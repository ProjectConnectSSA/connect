import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Extract the dynamic ID from the URL

    console.log("API GET form by ID", id);

    const { data, error } = await supabase.from("landing_pages").select("*").eq("id", id).single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
