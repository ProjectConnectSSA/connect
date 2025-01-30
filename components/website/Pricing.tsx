"use client";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">Choose the perfect plan for your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            title="Starter"
            price="$9"
            description="Perfect for individuals"
            features={["Up to 5 link pages", "Basic analytics", "Standard support", "1 team member"]}
          />
          <PricingCard
            title="Pro"
            price="$29"
            description="Great for professionals"
            features={["Unlimited link pages", "Advanced analytics", "Priority support", "5 team members", "Custom domains"]}
            highlighted={true}
          />
          <PricingCard
            title="Enterprise"
            price="$99"
            description="For large organizations"
            features={["Everything in Pro", "Enterprise support", "Unlimited team members", "Advanced security", "Custom integration"]}
          />
        </div>
      </div>
    </section>
  );
};

const PricingCard = ({
  title,
  price,
  description,
  features,
  highlighted = false,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-xl p-8 ${highlighted ? "bg-indigo-600 text-white ring-4 ring-indigo-600" : "bg-white text-gray-900"}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="text-4xl font-bold mb-2">
          {price}
          <span className="text-lg">/mo</span>
        </div>
        <p className={highlighted ? "text-indigo-100" : "text-gray-600"}>{description}</p>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-3 px-6 rounded-full font-semibold transition-colors ${
          highlighted ? "bg-white text-indigo-600 hover:bg-gray-100" : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}>
        Get Started
      </button>
    </motion.div>
  );
};

export default Pricing;
