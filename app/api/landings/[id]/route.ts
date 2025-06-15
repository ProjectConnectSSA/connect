import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Await the params object before accessing its properties
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        { error: "Landing page ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from("landing_pages").select("*").eq("id", id).single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // First get the current visit count
    const { data: landingPage, error: fetchError } = await supabase
      .from("landing_pages")
      .select("visits")
      .eq("id", id)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    // Increment the visit count
    const currentVisits = landingPage?.visits || 0;
    const newVisitCount = currentVisits + 1;

    // Update the landing page record
    const { data, error } = await supabase
      .from("landing_pages")
      .update({ visits: newVisitCount })
      .eq("id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { success: true, visits: newVisitCount },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
