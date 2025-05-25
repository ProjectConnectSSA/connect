import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("Incrementing visit count for landing page:", id);

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
    console.log(`Updating visits from ${currentVisits} to ${newVisitCount}`);

    // Update the landing page record
    const { error } = await supabase
      .from("landing_pages")
      .update({ visits: newVisitCount })
      .eq("id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { success: true, visits: newVisitCount },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Visit tracking error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
