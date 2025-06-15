import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// GET: Fetch all email templates for the authenticated user
export async function GET(request: NextRequest) {
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
    
    // Fetch all email templates for this user
    const { data, error } = await (await supabase)
      .from("emails")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching email templates:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error in GET /api/emails:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new email template
export async function POST(request: NextRequest) {
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
    
    // Parse request body
    const body = await request.json();
    const { title, content, html } = body;
    
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    
    // Insert new email template
    const { data, error } = await (await supabase)
      .from("emails")
      .insert([
        {
          user_id: user.id,
          title,
          content,
          html: html || null,
          status: "draft"
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating email template:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error in POST /api/emails:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}