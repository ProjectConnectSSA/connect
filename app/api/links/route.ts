import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

import { UUID } from "crypto";

import { getCurrentUser } from "@/app/actions";

interface FormData {
  title: string;
  user_id: UUID;
}

// Function to fetch all forms
export async function GET() {
  try {
    console.log("API GET forms");
    const currentUser = await getCurrentUser();
    const { data, error: formsError } = await supabase.from("link_forms").select("*");
    if (formsError) {
      throw new Error(formsError.message);
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to create a new form
export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.json();
    console.log("API CREATE form", formData);
    const { data, error } = await supabase.from("link_forms").insert([formData]).select().single();
    console.log("api response", data);
    if (error) throw new Error(error.message);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to update a form
export async function PUT(req: NextRequest) {
  try {
    const { id, ...formData }: { id: string } & FormData = await req.json();
    console.log("API UPDATE form", id, formData);
    const { data, error } = await supabase.from("link_forms").update(formData).eq("id", id).single();
    if (error) throw new Error(error.message);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to delete a form
export async function DELETE(req: NextRequest) {
  try {
    const { id }: { id: string } = await req.json();
    console.log("API DELETE form", id);
    const { data, error } = await supabase.from("link_forms").delete().eq("id", id).single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ message: "Form deleted successfully", data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
