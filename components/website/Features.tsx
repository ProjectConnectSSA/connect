"use client";
import { motion } from "framer-motion";
import { BarChart3, Palette, Globe2, Share2, ShieldCheck, Zap } from "lucide-react";

const Features = () => {
  return (
    <section
      id="features"
      className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern Creators</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to manage your digital presence and grow your audience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BarChart3 />}
            title="Advanced Analytics"
            description="Track your performance with detailed analytics and insights"
          />
          <FeatureCard
            icon={<Palette />}
            title="Customization"
            description="Personalize every aspect to match your brand identity"
          />
          <FeatureCard
            icon={<Globe2 />}
            title="Global CDN"
            description="Lightning-fast delivery worldwide with our reliable CDN"
          />
          <FeatureCard
            icon={<Share2 />}
            title="Social Integration"
            description="Connect and share across all major social platforms"
          />
          <FeatureCard
            icon={<ShieldCheck />}
            title="Enterprise Security"
            description="Bank-grade security to protect your data and privacy"
          />
          <FeatureCard
            icon={<Zap />}
            title="Automation"
            description="Automate workflows and save time with smart tools"
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-50 p-6 rounded-xl">
      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default Features;
