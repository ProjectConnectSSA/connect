import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Lead } from "@/app/types/LeadType";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string; // use service role for server-side
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { userId, email, sourceType, sourceId, createdAt, status, campaignTag } = req.body;
      // Insert into Supabase 'leads' table
      const { data, error } = await supabase
        .from("leads")
        .insert([
          {
            user_id: userId,
            email,
            source_type: sourceType,
            source_id: sourceId,
            created_at: createdAt,
            status: status || "pending",
            campaign_tag: campaignTag || null,
          },
        ])
        .select()
        .single();

      if (error || !data) {
        console.error("Supabase insert error:", error);
        return res.status(500).json({ error: error?.message || "Failed to save lead" });
      }

      // Map returned record to Lead interface
      const lead: Lead = {
        id: data.id,
        userId: data.user_id,
        email: data.email,
        sourceType: data.source_type,
        sourceId: data.source_id,
        createdAt: data.created_at,
        status: data.status,
        campaignTag: data.campaign_tag || undefined,
      };

      return res.status(201).json(lead);
    } catch (err) {
      console.error("API handler error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
