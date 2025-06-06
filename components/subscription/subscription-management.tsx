"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Star, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { subscriptionPlans, SubscriptionPlan } from "@/lib/subscription-plans";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionManagementProps {
  currentPlan: string | null;
  subscriptionStatus: string | null;
  userId: string;
  onSubscriptionChange?: () => void;
}

export default function SubscriptionManagement({ currentPlan, subscriptionStatus, userId, onSubscriptionChange }: SubscriptionManagementProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  console.log("Current Plan:", currentPlan);
  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (plan.id === "free") {
      toast.info("You're already on the free plan!");
      return;
    }

    setIsLoading(plan.id);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: userId,
          currentPlan: currentPlan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading("manage");

    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create portal session");
      }

      window.open(data.url, "_blank");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(null);
    }
  };

  const getCurrentPlanDetails = () => {
    if (!currentPlan) return subscriptionPlans[0]; // Return free plan
    return subscriptionPlans.find((plan) => plan.id === currentPlan) || subscriptionPlans[0];
  };

  const currentPlanDetails = getCurrentPlanDetails();
  const hasActiveSubscription = subscriptionStatus === "active";
  console.log("Current Plan Details:", currentPlanDetails);
  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Plan
            <Badge variant={hasActiveSubscription ? "default" : "secondary"}>{currentPlanDetails.name}</Badge>
          </CardTitle>
          <CardDescription>{hasActiveSubscription ? "You have an active subscription" : "You're currently on the free plan"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">
                ${currentPlanDetails.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <p className="text-sm text-muted-foreground">{currentPlanDetails.description}</p>
            </div>
            {hasActiveSubscription && (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={isLoading === "manage"}>
                {isLoading === "manage" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {subscriptionPlans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan || (plan.id === "free" && !currentPlan);
            const isPopular = plan.popular;

            return (
              <Card
                key={plan.id}
                className={`relative ${isPopular ? "border-primary" : ""}`}>
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {isCurrentPlan && <Badge variant="secondary">Current</Badge>}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Usage Limits */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Usage Limits:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>Links: {plan.limits.links === 20 ? "20" : plan.limits.links}</span>
                      <span>Forms: {plan.limits.forms === 20 ? "20" : plan.limits.forms}</span>
                      <span>Emails: {plan.limits.emails === 20 ? "20" : plan.limits.emails}</span>
                      <span>Pages: {plan.limits.landingPages === 20 ? "20" : plan.limits.landingPages}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "secondary" : "default"}
                    onClick={() => handleSubscribe(plan)}
                    disabled={isCurrentPlan || isLoading === plan.id}>
                    {isLoading === plan.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isCurrentPlan ? "Current Plan" : plan.id === "free" ? "Downgrade to Free" : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
