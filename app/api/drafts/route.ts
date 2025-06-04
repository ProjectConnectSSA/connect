// app/api/drafts/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { EmailDraft } from "@/app/types/database";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("email_drafts").select("*").eq("user_id", user_id);

  if (error) {
    console.error("GET /api/drafts error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, title, template } = body as EmailDraft;

    if (!user_id || !title || !template) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("email_drafts").insert([{ user_id, title, template }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Draft saved successfully", data }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/drafts exception:", err);
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}
