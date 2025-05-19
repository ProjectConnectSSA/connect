import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

interface LandingPage {
  title: string;
  description: string;
  sections: any[];
  user_id: string;
  styles: {
    theme?: string;
    fontFamily?: string;
    colors?: {
      primary?: string;
      background?: string;
      text?: string;
    };
    spacing?: string;
    animation?: string;
    borderRadius?: string;
    darkMode?: boolean;
    responsiveImages?: boolean;
  };
  domain?: {
    subdomain: string;
    custom?: string;
    status: string;
  };
  isactive?: boolean;
}

// Function to fetch all landing pages (filtered by user_id for security)
export async function GET(req: NextRequest) {
  try {
    // Get user_id from query params or auth token
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");

    let query = supabase.from("landing_pages").select("*");

    // If user_id provided, filter by it
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to create a new landing page
export async function POST(req: NextRequest) {
  try {
    const landingPage: LandingPage = await req.json();
    console.log("Received landing page data:", landingPage);

    // Validation
    if (!landingPage.user_id) {
      console.log("Missing user_id in request");
      return NextResponse.json(
        {
          error: "User ID is required",
          details: "The request did not include a user_id",
        },
        { status: 400 }
      );
    }

    if (!landingPage.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("landing_pages")
      .insert([
        {
          user_id: landingPage.user_id,
          title: landingPage.title,
          description: landingPage.description,
          sections: landingPage.sections,
          styles: landingPage.styles,
          domain: landingPage.domain,
          isactive: landingPage.isactive || false, // Changed from isActive
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("POST handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to update a landing page
export async function PUT(req: NextRequest) {
  try {
    const { id, ...landingPage }: { id: string } & LandingPage =
      await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Landing page ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("landing_pages")
      .update({
        title: landingPage.title,
        description: landingPage.description,
        sections: landingPage.sections,
        styles: landingPage.styles,
        domain: landingPage.domain,
        isactive: landingPage.isactive, // Changed from isActive
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to delete a landing page
export async function DELETE(req: NextRequest) {
  try {
    const { id }: { id: string } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Landing page ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("landing_pages")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { message: "Landing page deleted successfully", data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
