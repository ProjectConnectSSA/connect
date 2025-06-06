// app/api/stripe/create-checkout-session/route.ts (Corrected)
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/superAdminServer";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil", // Use a specific, stable API version
});

const supabase = supabaseAdmin;

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json(); // We don't need currentPlan here anymore

    if (!priceId || !userId) {
      return NextResponse.json({ error: "Price ID and User ID are required" }, { status: 400 });
    }

    const { data: profile, error: profileError } = await (await supabase).from("profiles").select("stripe_customer_id").eq("id", userId).single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
    }

    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      const { data: authUser, error: authError } = await (await supabase).auth.admin.getUserById(userId);

      if (authError || !authUser.user) {
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
      }

      const customer = await stripe.customers.create({
        email: authUser.user.email,
        metadata: {
          supabase_user_id: userId,
        },
      });

      customerId = customer.id;

      // IMPORTANT: Only update the customer ID here, not the plan!
      const { error: updateError } = await (await supabase).from("profiles").update({ stripe_customer_id: customerId }).eq("id", userId);

      if (updateError) {
        // This is a critical error, might be worth stopping the process
        console.error("Failed to update profile with Stripe customer ID:", updateError);
        return NextResponse.json({ error: "Failed to save customer reference" }, { status: 500 });
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile?canceled=true`,
      // Crucial for the webhook to identify the user
      metadata: {
        user_id: userId,
        price_id: priceId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
