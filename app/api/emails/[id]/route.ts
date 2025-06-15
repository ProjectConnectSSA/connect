import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// GET: Fetch a specific email template by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createClient();
  
  try {
    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await (await supabase).auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = params;
    
    // Handle "new" as a special case
    if (id === "new") {
      // Return an empty template structure
      return NextResponse.json({
        id: "new",
        title: "Untitled Email",
        content: {},
        status: "draft",
        user_id: user.id
      }, { status: 200 });
    }
    
    // Fetch the specific email template, ensuring it belongs to the authenticated user
    const { data, error } = await (await supabase)
      .from("emails")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Email template not found" }, { status: 404 });
      }
      console.error("Error fetching email template:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(`Unexpected error in GET /api/emails/${params.id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing email template
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createClient();
  
  try {
    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await (await supabase).auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = params;
    
    // Parse request body
    const body = await request.json();
    const { title, content, html, status } = body;
    
    // Handle case where we're creating from the "new" template
    if (id === "new") {
      // Create a new email template
      const { data, error } = await (await supabase)
        .from("emails")
        .insert([
          {
            user_id: user.id,
            title: title || "Untitled Email",
            content: content || {},
            html: html || null,
            status: status || "draft"
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating email template:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data, { status: 201 });
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (html !== undefined) updateData.html = html;
    if (status !== undefined) updateData.status = status;
    
    // Update the email template, ensuring it belongs to the authenticated user
    const { data, error } = await (await supabase)
      .from("emails")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Email template not found" }, { status: 404 });
      }
      console.error("Error updating email template:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(`Unexpected error in PUT /api/emails/${params.id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete an email template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createClient();
  
  try {
    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await (await supabase).auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = params;
    
    // Delete the email template, ensuring it belongs to the authenticated user
    const { error } = await (await supabase)
      .from("emails")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting email template:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Email template deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error(`Unexpected error in DELETE /api/emails/${params.id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}