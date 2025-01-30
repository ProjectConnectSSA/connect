import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";
import { UUID } from "crypto";

interface FormData {
  title: string;
  user_id: UUID;
  question?: Question[];
}

interface Question {
  id: string;
  title: string;
  type: string;
  imageUrl?: string;
  imageAlignment?: string;
  style?: {
    backgroundColor: "#ffffff";
    textColor: "#000000";
  };
}

// Function to fetch all forms
export async function GET() {
  try {
    console.log("API GET formal forms");
    const { data, error } = await supabase.from("forms").select("*");
    console.log("API GET formal forms", data);
    if (error) throw new Error(error.message);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to create a new form
export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.json();
    console.log("API CREATE formal form", formData);

    const { data, error } = await supabase
      .from("forms")
      .insert([{ user_id: formData.user_id, title: formData.title, question: formData.question }])
      .select();

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
    console.log("API UPDATE formal form", id, formData);
    const { data, error } = await supabase.from("forms").update(formData).eq("id", id).single();
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
    console.log("API DELETE formal form", id);
    const { data, error } = await supabase.from("forms").delete().eq("id", id).single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ message: "Form deleted successfully", data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
