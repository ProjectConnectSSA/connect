// app/api/links/route.ts (or wherever this code resides)
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // Use SERVER client
import { cookies } from "next/headers";

// Assuming LinkFormData defines the shape of link data for create/update
interface LinkFormData {
  title?: string;
  slug?: string;
  custom_domain?: string;
  active?: boolean;
  user_id?: string; // Optional for client-side, but enforced server-side
  // Add other link-specific fields here
}

// Function to fetch USER-SPECIFIC links
export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await (await supabase).auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: User not authenticated." }, { status: 401 });
    }
    const userId = user.id;

    // RLS handles security, but explicit filter is good practice
    const { data, error: linksError } = await (
      await supabase
    )
      .from("link_forms") // Ensure this is your correct links table name
      .select("*")
      .eq("user_id", userId) // Filter by authenticated user
      .order("created_at", { ascending: false }); // Optional: order results

    if (linksError) {
      console.error("Fetch Links Error:", linksError);
      throw new Error(`Failed to fetch links: ${linksError.message}`);
    }

    // Return the data consistent with original structure if needed, e.g. { data: links || [] }
    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/links Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to create a new link FOR THE AUTHENTICATED USER
export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await (await supabase).auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: User not authenticated." }, { status: 401 });
    }
    const userId = user.id;

    const linkInput: LinkFormData = await req.json();

    // Remove user_id if sent from client - enforce server-side user_id
    const { user_id: clientUserId, ...insertData } = linkInput as any;

    console.log("API CREATE link for user:", userId, insertData);

    const { data: newLink, error: insertError } = await (
      await supabase
    )
      .from("link_forms") // Ensure correct table name
      .insert({
        ...insertData, // Spread validated data
        user_id: userId, // *** Set user_id based on session ***
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert Link Error:", insertError);
      if (insertError.code === "23505") {
        // Unique constraint violation
        return NextResponse.json(
          { error: "Failed to create link: A link with this slug or custom domain might already exist.", details: insertError.message },
          { status: 409 }
        );
      }
      throw new Error(`Failed to create link: ${insertError.message}`);
    }
    if (!newLink) {
      throw new Error("Link data was not returned after insert.");
    }

    // Usage counter increment removed

    return NextResponse.json(newLink, { status: 201 }); // 201 Created
  } catch (error: any) {
    console.error("POST /api/links Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to update a link OWNED BY THE AUTHENTICATED USER
export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await (await supabase).auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: User not authenticated." }, { status: 401 });
    }
    const userId = user.id;

    // Extract ID and update data, exclude user_id from client payload
    const { id, user_id: clientUserId, ...updateData }: { id: string } & LinkFormData = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Link ID is required for update." }, { status: 400 });
    }

    console.log("API UPDATE link:", id, "for user:", userId, updateData);

    const {
      data: updatedLink,
      error: updateError,
      count,
    } = await (
      await supabase
    )
      .from("link_forms") // Ensure correct table name
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId) // *** Ensure user owns the record ***
      .select()
      .single();

    if (updateError) {
      console.error("Update Link Error:", updateError);
      if (updateError.code === "23505") {
        return NextResponse.json(
          { error: "Update failed: A link with this slug or custom domain might already exist.", details: updateError.message },
          { status: 409 }
        );
      }
      throw new Error(`Failed to update link: ${updateError.message}`);
    }

    if (!updatedLink) {
      const { data: existsData } = await (await supabase).from("link_forms").select("id").eq("id", id).maybeSingle();
      if (existsData) {
        return NextResponse.json({ error: "Forbidden: You do not have permission to update this link." }, { status: 403 });
      } else {
        return NextResponse.json({ error: "Link not found." }, { status: 404 });
      }
    }

    return NextResponse.json(updatedLink, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/links Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to delete a link OWNED BY THE AUTHENTICATED USER
export async function DELETE(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await (await supabase).auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: User not authenticated." }, { status: 401 });
    }
    const userId = user.id;

    const { id }: { id: string } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Link ID is required for deletion." }, { status: 400 });
    }

    console.log("API DELETE link:", id, "for user:", userId);

    // Delete the record, ensuring user ownership
    const { error: deleteError, count } = await (
      await supabase
    )
      .from("link_forms") // Ensure correct table name
      .delete()
      .eq("id", id)
      .eq("user_id", userId); // *** Ensure user owns the record ***

    if (deleteError) {
      console.error("Delete Link Error:", deleteError);
      throw new Error(`Failed to delete link: ${deleteError.message}`);
    }

    if (count === 0) {
      const { data: existsData } = await (await supabase).from("link_forms").select("id").eq("id", id).maybeSingle();
      if (existsData) {
        return NextResponse.json({ error: "Forbidden: You do not have permission to delete this link." }, { status: 403 });
      } else {
        return NextResponse.json({ error: "Link not found." }, { status: 404 });
      }
    }

    // Usage counter decrement removed

    return NextResponse.json({ message: "Link deleted successfully" }, { status: 200 }); // Or 204 No Content
  } catch (error: any) {
    console.error("DELETE /api/links Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
