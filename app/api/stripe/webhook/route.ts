// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/superAdminServer";
import { subscriptionPlans } from "@/lib/subscription-plans"; // You'll need this to map priceId to your planId

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = supabaseAdmin;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve metadata we passed in create-checkout-session
    const userId = session.metadata?.user_id;
    const priceId = session.metadata?.price_id;
    console.log("Checkout session completed for user:", userId, "with priceId:", priceId, session.metadata);
    if (!userId) {
      console.error("Webhook Error: User ID not found in session metadata.");
      return new NextResponse("Webhook Error: User ID missing", { status: 400 });
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    // Map the Stripe priceId to your internal plan ID (e.g., 'pro', 'business')
    const plan = subscriptionPlans.find((p) => p.priceId === priceId);
    console.log("Plan found:", plan);
    if (!plan) {
      console.error(`Webhook Error: Plan not found for priceId ${priceId}`);
      return new NextResponse("Webhook Error: Plan not found", { status: 400 });
    }

    // Update the user's profile in Supabase
    const { error } = await (
      await supabase
    )
      .from("profiles")
      .update({
        current_plan: plan.id, // e.g., 'pro'
        links_usage: plan.limits.links,
        forms_usage: plan.limits.forms,
        emails_usage: plan.limits.emails,
        landing_pages_usage: plan.limits.landingPages,
      })
      .eq("id", userId);

    if (error) {
      console.error("Webhook Error: Failed to update user profile", error);
      return new NextResponse("Webhook Error: Database update failed", { status: 500 });
    }
  }

  // Also handle subscription updates/cancellations
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const priceId = subscription.items.data[0].price.id;
    const plan = subscriptionPlans.find((p) => p.priceId === priceId);

    // Get the customer to find our user_id
    const customer = (await stripe.customers.retrieve(subscription.customer as string)) as Stripe.Customer;
    const userId = customer.metadata.supabase_user_id;

    if (!userId) {
      console.error("Webhook Error: supabase_user_id not found in customer metadata.");
      return new NextResponse("Webhook Error: User ID missing", { status: 400 });
    }

    const { error } = await (
      await supabase
    )
      .from("profiles")
      .update({
        current_plan: event.type === "customer.subscription.deleted" ? "free" : plan?.id || "free",
        subscription_status: subscription.status,
      })
      .eq("id", userId);

    if (error) {
      console.error("Webhook Error: Failed to update user profile on subscription change", error);
      return new NextResponse("Webhook Error: Database update failed", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
