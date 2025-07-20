// app/api/analytics/page-events/[pageId]/route.ts
import { NextResponse } from "next/server";
// We don't need createRouteHandlerClient or cookies if not doing auth here
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

// Assuming createClient() from "@/utils/supabase/client" can create a Supabase client
// instance that can operate on the server-side for this demo.
import { createClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";
export async function GET(request: Request, { params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params;

  if (!pageId) {
    return NextResponse.json({ error: "Page ID is required in URL path" }, { status: 400 });
  }

  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!uuidRegex.test(pageId)) {
    return NextResponse.json({ error: "Invalid pageId format in URL path" }, { status: 400 });
  }

  const supabase = createClient();

  try {
    const { data, error: fetchError } = await supabase.from("link_analytics").select("*").eq("page_id", pageId);
    console.log("Fetching view records for pageId:", data);
    if (fetchError) {
      console.error("Supabase error fetching view records:", fetchError);
      if (fetchError.message.includes("relation") && fetchError.message.includes("does not exist")) {
        return NextResponse.json({ error: `Table 'link_analytics' not found. Please ensure it exists.` }, { status: 500 });
      }
      if (fetchError.code === "42501") {
        return NextResponse.json({ error: `Permission denied for table 'link_analytics'. Check RLS policies.` }, { status: 403 });
      }
      return NextResponse.json({ error: `Failed to fetch view records: ${fetchError.message}` }, { status: 500 });
    }

    return NextResponse.json({ viewRecords: data || [] }, { status: 200 });
  } catch (e: any) {
    console.error("Error processing GET request:", e);
    return NextResponse.json({ error: `Internal server error: ${e.message}` }, { status: 500 });
  }
}
