// app/api/drafts/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { EmailDraft } from "@/app/types/database";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient(cookies());
  const { data, error } = await (await supabase).from("email_drafts").select("*").eq("id", id).single();

  if (error) {
    console.error("GET /api/drafts/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { title, template } = body as EmailDraft;
    const supabase = createClient(cookies());
    const { data, error } = await (await supabase).from("email_drafts").update({ title, template, updated_at: new Date() }).eq("id", id);

    if (error) {
      console.error("PUT /api/drafts/[id] error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Draft updated successfully", data }, { status: 200 });
  } catch (err: any) {
    console.error("PUT /api/drafts/[id] exception:", err);
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient(cookies());
  const { error } = await (await supabase).from("email_drafts").delete().eq("id", id);

  if (error) {
    console.error("DELETE /api/drafts/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Draft deleted successfully" }, { status: 200 });
}
