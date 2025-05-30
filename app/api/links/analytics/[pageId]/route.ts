// app/api/analytics/page-events/[pageId]/route.ts
import { NextResponse } from "next/server";
// We don't need createRouteHandlerClient or cookies if not doing auth here
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

// Assuming createClient() from "@/utils/supabase/client" can create a Supabase client
// instance that can operate on the server-side for this demo.
import { createClient } from "@/utils/supabase/client";

export async function GET(request: Request, { params }: { params: { pageId: string } }) {
  const { pageId } = params;

  if (!pageId) {
    return NextResponse.json({ error: "Page ID is required in URL path" }, { status: 400 });
  }

  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!uuidRegex.test(pageId)) {
    return NextResponse.json({ error: "Invalid pageId format in URL path" }, { status: 400 });
  }

  // Initialize Supabase client.
  // For a demo without auth, this client needs to have permissions to read 'link_analytics'.
  const supabase = createClient();

  try {
    // Fetch all view records for the specified page_id
    // Select specific columns you need on the client.
    // If you want all columns, use .select("*")
    const { data, error: fetchError } = await supabase
      .from("link_analytics")
      .select("id, viewed_at,  user_agent, referrer, country") // Example: select specific useful columns
      // Or to select all columns: .select("*")
      .eq("page_id", pageId);
    console.log("Fetching view records for pageId:", data);
    if (fetchError) {
      console.error("Supabase error fetching view records:", fetchError);
      // Check if the error is because the table doesn't exist or RLS is blocking
      if (fetchError.message.includes("relation") && fetchError.message.includes("does not exist")) {
        return NextResponse.json({ error: `Table 'link_analytics' not found. Please ensure it exists.` }, { status: 500 });
      }
      if (fetchError.code === "42501") {
        // permission denied
        return NextResponse.json({ error: `Permission denied for table 'link_analytics'. Check RLS policies.` }, { status: 403 });
      }
      return NextResponse.json({ error: `Failed to fetch view records: ${fetchError.message}` }, { status: 500 });
    }

    // Return the array of view records.
    return NextResponse.json({ viewRecords: data || [] }, { status: 200 });
  } catch (e: any) {
    console.error("Error processing GET request:", e);
    return NextResponse.json({ error: `Internal server error: ${e.message}` }, { status: 500 });
  }
}
