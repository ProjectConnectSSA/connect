import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Shared helper to get supabase and user
async function getSupabaseAndUser() {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await (await supabase).auth.getSession();
  if (error || !session?.user) throw new Error("Unauthorized");
  return { supabase, userId: session.user.id };
}

// GET: fetch latest notifications
export async function GET() {
  try {
    const { supabase, userId } = await getSupabaseAndUser();
    const { data, error } = await (await supabase)
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "Unauthorized" ? 401 : 500 });
  }
}

// POST: mark ALL notifications as read
export async function POST() {
  try {
    const { supabase, userId } = await getSupabaseAndUser();
    const now = new Date().toISOString();
    const { error } = await (await supabase).from("notifications").update({ read_at: null }).eq("user_id", userId).is("read_at", null);
    if (error) throw error;
    return NextResponse.json({ message: "All marked read" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "Unauthorized" ? 401 : 500 });
  }
}

// PATCH: mark specific notifications as read
export async function PATCH(request: Request) {
  try {
    const { supabase, userId } = await getSupabaseAndUser();
    const { ids } = await request.json();
    if (!Array.isArray(ids)) throw new Error("Invalid payload");
    const now = new Date().toISOString();
    const { error } = await (await supabase).from("notifications").update({ read_at: now }).eq("user_id", userId).in("id", ids);
    if (error) throw error;
    return NextResponse.json({ message: "Marked read" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "Unauthorized" ? 401 : 500 });
  }
}

// DELETE: delete specific notification(s)
export async function DELETE(request: Request) {
  try {
    const { supabase, userId } = await getSupabaseAndUser();
    const { id, ids } = await request.json();
    console.log("Received DELETE request with id:", id, "and ids:", ids);
    let toDelete: number[] = [];
    if (id) {
      toDelete.push(id);
    } else if (Array.isArray(ids)) {
      toDelete = ids;
    } else {
      throw new Error("Invalid payload");
    }

    console.log("Deleting notifications with IDs:", toDelete);
    const { error } = await (await supabase).from("notifications").delete().eq("user_id", userId).in("id", toDelete);

    if (error) throw error;
    return NextResponse.json({ message: "Deleted" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "Unauthorized" ? 401 : 500 });
  }
}
