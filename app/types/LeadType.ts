// src/app/types/leads.ts

/**
 * Represents a captured lead from any source within the multi‐tenant app.
 */
export interface Lead {
  /** Unique identifier for the lead */
  id: string;
  /** ID of the tenant (user) who owns this lead */
  userId: string;
  /** Subscriber's email */
  email: string;
  /** Where the lead came from */
  sourceType: "linktree" | "form" | "landing" | "emailCampaign";
  /** Identifier of that specific source (e.g., page slug, form ID, campaign ID) */
  sourceId: string;
  /** ISO timestamp of creation */
  createdAt: string;
  /** Optional status: pending (unconfirmed), confirmed, unsubscribed */
  status?: "pending" | "confirmed" | "unsubscribed";
  /** Optional tag or campaign metadata */
  campaignTag?: string;
}
