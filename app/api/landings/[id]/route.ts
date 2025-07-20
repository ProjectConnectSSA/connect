import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Landing page ID is required" }, { status: 400 });
    }

    const supabase = createClient(cookies());
    const { data, error } = await (await supabase).from("landing_pages").select("*").eq("id", id).single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createClient(cookies());

    // First get the current visit count
    const { data: landingPage, error: fetchError } = await (await supabase).from("landing_pages").select("visits").eq("id", id).single();

    if (fetchError) throw new Error(fetchError.message);

    // Increment the visit count
    const currentVisits = landingPage?.visits || 0;
    const newVisitCount = currentVisits + 1;

    // Update the landing page record
    const { data, error } = await (await supabase).from("landing_pages").update({ visits: newVisitCount }).eq("id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, visits: newVisitCount }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
