import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data, error } = await supabase
      .from("landing_pages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
