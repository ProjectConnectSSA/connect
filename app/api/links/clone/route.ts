// app/api/links/clone/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// Helper function to generate a unique slug for the clone
async function generateUniqueSlug(supabaseClient: any, originalSlug: string, userId: string): Promise<string> {
  let newSlug = `${originalSlug}-copy`;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const { data, error } = await supabaseClient
      .from("link_forms")
      .select("slug")
      .eq("slug", newSlug)
      .eq("user_id", userId) // Check uniqueness within the same user's links
      .maybeSingle();

    if (error) {
      console.error("Error checking slug uniqueness:", error);
      throw new Error("Failed to verify slug uniqueness."); // Or handle differently
    }

    if (!data) {
      isUnique = true; // Slug is unique
    } else {
      counter++;
      newSlug = `${originalSlug}-copy-${counter}`;
    }
  }
  return newSlug;
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(); // Assuming createClient returns a Promise<SupabaseClient>

  try {
    const {
      data: { user },
      error: authError,
    } = await (await supabase).auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: User not authenticated." }, { status: 401 });
    }
    const userId = user.id;

    const { id: originalId }: { id: string } = await req.json();

    if (!originalId) {
      return NextResponse.json({ error: "Original Link ID is required for cloning." }, { status: 400 });
    }

    console.log("API CLONE request for link ID:", originalId, "by user:", userId);

    // 1. Fetch the original link, ensuring user owns it
    const { data: originalLink, error: fetchError } = await (
      await supabase
    )
      .from("link_forms")
      .select("*") // Select all fields to clone
      .eq("id", originalId)
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      console.error("Fetch Original Link for Clone Error:", fetchError);
      if (fetchError.code === "PGRST116") {
        // PostgREST error for " dokładnie jeden wiersz" (exactly one row) not returned
        return NextResponse.json({ error: "Original link not found or you do not own it." }, { status: 404 });
      }
      throw new Error(`Failed to fetch original link: ${fetchError.message}`);
    }

    if (!originalLink) {
      return NextResponse.json({ error: "Original link not found or you do not own it." }, { status: 404 });
    }

    // (Optional but Recommended) Server-side check for page limits if you have such a feature
    // Example:
    // const { data: profile, error: profileError } = await (await supabase)
    //   .from('profiles') // or your user metadata table
    //   .select('current_links_count, link_limit')
    //   .eq('id', userId)
    //   .single();
    // if (profile && profile.link_limit !== null && profile.current_links_count >= profile.link_limit) {
    //   return NextResponse.json({ error: "Page limit reached. Cannot clone page." }, { status: 403 });
    // }

    // 2. Prepare data for the new (cloned) link
    const {
      id, // Exclude original ID
      created_at, // Let DB set new timestamps
      updated_at, // Let DB set new timestamps
      slug: originalSlug,
      ...clonableData // Rest of the fields from originalLink
    } = originalLink;

    const newSlug = await generateUniqueSlug(await supabase, originalSlug || "cloned-page", userId);

    const newLinkData = {
      ...clonableData,
      slug: newSlug,
      active: true, // Default cloned pages to inactive, or use originalLink.active
      user_id: userId, // Ensure user_id is set
      // created_at and updated_at will be set by the database on insert
    };

    // 3. Insert the new (cloned) link
    const { data: clonedLink, error: insertError } = await (await supabase).from("link_forms").insert(newLinkData).select().single();

    if (insertError) {
      console.error("Insert Cloned Link Error:", insertError);
      if (insertError.code === "23505") {
        // This should ideally be caught by generateUniqueSlug, but as a fallback
        return NextResponse.json(
          { error: "Failed to clone link: A link with the generated slug might already exist.", details: insertError.message },
          { status: 409 }
        );
      }
      throw new Error(`Failed to clone link: ${insertError.message}`);
    }

    if (!clonedLink) {
      throw new Error("Cloned link data was not returned after insert.");
    }

    // (Optional) Increment user's link count if you are tracking it server-side
    // await (await supabase).rpc('increment_user_link_count', { user_id_param: userId });
    // or update profile table

    // The frontend expects the response to be { data: newClonedPage }
    return NextResponse.json({ data: clonedLink }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/links/clone Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
