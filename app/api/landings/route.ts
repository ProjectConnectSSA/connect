import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UUID } from "crypto";

interface LandingPage {
  title: string;
  description: string;
  pages: Pages[];
  background?: string;
  user_id: string;
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
const supabase = createClient();
// Function to fetch all landingPages
export async function GET() {
  try {
    console.log("API GET landingPageal landingPages");
    const { data, error } = await supabase.from("landing_pages").select("*");
    console.log("API GET landingPageal landingPages", data);
    if (error) throw new Error(error.message);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to create a new landingPage
export async function POST(req: NextRequest) {
  try {
    const landingPage: LandingPage = await req.json();
    console.log("API CREATE landingPageal landingPage", landingPage.isMultiPage);

    const { data, error } = await supabase
      .from("landing_pages")
      .insert([
        {
          user_id: landingPage.user_id,
          title: landingPage.title,
          pages: landingPage.pages,
          styles: landingPage.styles,
          isMultiPage: landingPage.isMultiPage,
          isActive: landingPage.isActive,
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

// Function to update a landingPage
export async function PUT(req: NextRequest) {
  try {
    const { id, ...landingPage }: { id: string } & LandingPage = await req.json();
    console.log("API UPDATE landingPageal landingPage", id, "data", landingPage);

    const { data, error } = await supabase.from("landing_pages").update(landingPage).eq("id", id).select().single(); // Ensures only one record is fetched

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to delete a landingPage
export async function DELETE(req: NextRequest) {
  try {
    const { id }: { id: string } = await req.json();
    console.log("API DELETE landingPageal landingPage", id);
    const { data, error } = await supabase.from("landing_pages").delete().eq("id", id).single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ message: "LandingPage deleted successfully", data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
