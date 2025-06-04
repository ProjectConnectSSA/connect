// File: src/app/api/leads/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

import { Lead } from "@/app/types/LeadType";

/**
 * GET /api/leads
 * Retrieves all leads for the authenticated tenant, most recent first.
 */
const supabase = await createClient();
export async function GET(req: NextRequest) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("leads").select("*").order("createdAt", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching leads:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/leads
 * Creates a new lead under the authenticated tenant.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      sourceType,
      sourceId,
      status = "pending",
      campaignTag = null,
    }: {
      email: string;
      sourceType: Lead["sourceType"];
      sourceId: string;
      status?: Lead["status"];
      campaignTag?: string | null;
    } = body;

    const record = {
      email,
      sourceType: sourceType,
      sourceId: sourceId,
      createdAt: new Date().toISOString(),
      status,
      campaignTag: campaignTag,
    };

    const { data, error } = await supabase.from("leads").insert([record]).select().single();

    if (error || !data) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error?.message || "Failed to save lead" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("Error creating lead:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, campaignTag }: { id: string; campaignTag: string | null } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing lead ID" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("leads")
      .update({ campaignTag: campaignTag })
      .eq("id", id)

      .select()
      .single();

    if (error || !data) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: error?.message || "Failed to update lead" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Error patching lead:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
