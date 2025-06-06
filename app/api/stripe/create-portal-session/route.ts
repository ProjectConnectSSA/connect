// app/api/stripe/create-portal-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

const supabase = createClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get user profile with Stripe customer ID
    const { data: profile, error: profileError } = await (await supabase).from("profiles").select("stripe_customer_id").eq("id", userId).single();

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.json({ error: "Customer not found or no active subscription" }, { status: 404 });
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Portal session creation error:", error);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}
