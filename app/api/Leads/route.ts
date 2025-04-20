// File: src/app/api/leads/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/app/actions";
import { Lead } from "@/app/types/LeadType";

/**
 * GET /api/leads
 * Retrieves all leads for the authenticated tenant, most recent first.
 */
export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("leads").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false });

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
      source_type: sourceType,
      source_id: sourceId,
      created_at: new Date().toISOString(),
      status,
      campaign_tag: campaignTag,
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
