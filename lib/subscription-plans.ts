export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string; // Stripe Price ID
  features: string[];
  limits: {
    links: number;
    forms: number;
    emails: number;
    landingPages: number;
  };
  popular?: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    priceId: "", // No Stripe price for free plan
    features: ["Basic link management", "Simple forms", "Email notifications", "Basic landing pages", "Community support"],
    limits: {
      links: 5,
      forms: 5,
      emails: 5,
      landingPages: 5,
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses",
    price: 19.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!, // Replace with your actual Stripe Price ID
    features: [
      "More links",
      "Advanced forms with logic",
      "More emails",
      "Custom landing pages",
      "Analytics dashboard",
      "Priority support",
      "Custom domains",
    ],
    limits: {
      links: 20,
      forms: 20,
      emails: 20,
      landingPages: 20,
    },
    popular: true,
  },
  {
    id: "max",
    name: "Max",
    description: "For growing businesses",
    price: 29.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_Max_PRICE_ID!, // Replace with your actual Stripe Price ID
    features: [
      "More links",
      "Advanced forms with logic",
      "More emails",
      "Custom landing pages",
      "Analytics dashboard",
      "Priority support",
      "Custom domains",
    ],
    limits: {
      links: 80,
      forms: 80,
      emails: 80,
      landingPages: 80,
    },
    popular: false,
  },
];

export function getPlanByPriceId(priceId: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find((plan) => plan.priceId === priceId);
}

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find((plan) => plan.id === planId);
}

export function getFreePlan(): SubscriptionPlan {
  return subscriptionPlans[0]; // Free plan is always first
}
