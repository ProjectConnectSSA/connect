import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UUID } from "crypto";
import { cookies } from "next/headers";
interface Form {
  title: string;
  description: string;
  pages: Pages[];
  background?: string;
  user_id: string;
  conditions?: Condition[];
  styles?: {
    width?: string;
    height?: string;
    columns?: number;
  };
  isActive?: boolean;
  isMultiPage?: boolean;
}

interface Pages {
  id: string;
  title: string;
  elements: Elements[];
  background?: string;
}

interface Elements {
  id: string;
  title: string;
  styles: {
    backgroundColor?: string;
    width?: string;
    height?: string;
  };
  type: string;
  required: boolean;
}

interface Condition {
  id: string;
  sourcePageId: string;
  elementId: string;
  operator: string;
  value: string;
  targetPageId: string;
}

// Function to fetch all forms
export async function GET() {
  try {
    const supabase = createClient(cookies());
    const {
      data: { user },
      error: authError,
    } = await (await supabase).auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: User not authenticated." }, { status: 401 });
    }
    const userId = user.id;
    console.log("API GET formal forms");

    const { data, error } = await (await supabase).from("forms").select("*").eq("user_id", user.id);
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
    const supabase = createClient(cookies());
    const form: Form = await req.json();
    console.log("API CREATE formal form", form.isMultiPage);

    const { data, error } = await (
      await supabase
    )
      .from("forms")
      .insert([
        {
          user_id: form.user_id,
          title: form.title,
          pages: form.pages,
          styles: form.styles,
          isMultiPage: form.isMultiPage,
          isActive: form.isActive,
          conditions: form.conditions,
        },
      ])
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
    const supabase = createClient(cookies());
    const { id, ...form }: { id: string } & Form = await req.json();
    console.log("API UPDATE formal form", id, "data", form);

    const { data, error } = await (await supabase).from("forms").update(form).eq("id", id).select().single(); // Ensures only one record is fetched

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to delete a form
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient(cookies());
    const { id }: { id: string } = await req.json();
    console.log("API DELETE formal form", id);
    const { data, error } = await (await supabase).from("forms").delete().eq("id", id).single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ message: "Form deleted successfully", data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
