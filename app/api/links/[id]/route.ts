// app/api/links/[id]/route.ts - For PUBLICLY fetching an ACTIVE link by ID
import { NextRequest, NextResponse } from "next/server";
// Use the standard Supabase client here, as no user session is needed
import { createClient } from "@/lib/supabase/client"; // Or use the admin client if preferred for reads

// Initialize Supabase Client (ensure environment variables are set)
// Using the ANON key is appropriate for public reads allowed by RLS

const supabase = createClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const linkId = params.id;

    if (!linkId) {
      return NextResponse.json({ error: "Link ID parameter is missing." }, { status: 400 });
    }

    console.log("API PUBLIC GET link by ID request:", linkId);

    // Fetch the specific link ONLY IF ACTIVE
    // RLS provides the primary security, but adding active = true here is good practice.
    const { data, error: fetchError } = await supabase
      .from("link_forms") // Ensure correct table name
      .select("*") // Select all necessary columns for public display
      .eq("id", linkId)
      .eq("active", true) // *** Ensure only active links are fetched ***
      .single();

    // Handle errors
    if (fetchError) {
      // "No rows found" - means link doesn't exist OR it's inactive
      if (fetchError.code === "PGRST116") {
        console.log(`Public link not found or inactive: ${linkId}`);
        return NextResponse.json({ error: "Link not found or is inactive." }, { status: 404 });
      }
      // Other database errors
      console.error("Public Database Fetch Error:", fetchError);
      // Avoid exposing detailed errors publicly
      return NextResponse.json({ error: "Failed to fetch link data." }, { status: 500 });
    }

    if (!data) {
      console.log(`Public link not found or inactive (data null): ${linkId}`);
      return NextResponse.json({ error: "Link not found or is inactive." }, { status: 404 });
    }

    // Return the fetched link data
    console.log("API PUBLIC GET link by ID success:", data.id);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/links/[id] Public Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
