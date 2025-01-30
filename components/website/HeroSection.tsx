"use client";
import { motion } from "framer-motion";
import { ArrowRight, Link, FormInput, Mail, Layout } from "lucide-react";

import CubeLogo from "./CubeLoggo";
const features = [
  {
    icon: <Link className="w-6 h-6" />,
    title: "Link Management",
    description: "Create and manage all your important links in one place",
    color: "bg-gradient-to-br from-indigo-500 to-purple-500",
    mockImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="240" height="160" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          .element { fill: #6366F1; transition: fill 0.3s ease-in-out; }
          .element:hover { fill: #F59E0B; }
          .element2 { fill: #6366F1; transition: fill 0.3s ease-in-out; }
          .element2:hover { fill: #8B5CF6; }
          .element3 { fill: #6366F1; transition: fill 0.3s ease-in-out; }
          .element3:hover { fill: #EC4899; }
        </style>
        <rect width="240" height="160" fill="#F8FAFC"/>
        <rect x="20" y="20" width="200" height="40" rx="8" class="element"/>
        <rect x="20" y="70" width="200" height="30" rx="6" class="element2"/>
        <rect x="20" y="110" width="200" height="30" rx="6" class="element3"/>
        <circle cx="40" cy="40" r="10" fill="white"/>
        <rect x="60" y="35" width="140" height="10" rx="2" fill="white"/>
      </svg>
    `)}`,
  },
  {
    icon: <FormInput className="w-6 h-6" />,
    title: "Form Builder",
    description: "Build interactive forms with our drag-and-drop editor",
    color: "bg-gradient-to-br from-pink-500 to-rose-500",
    mockImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="240" height="160" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          .element { fill: #6366F1; transition: fill 0.3s ease-in-out; }
          .element:hover { fill: #8B5CF6; }
          .element2 { fill: #6366F1; transition: fill 0.3s ease-in-out; }
          .element2:hover { fill: #EC4899; }
          .element3 { fill: #6366F1; transition: fill 0.3s ease-in-out; }
          .element3:hover { fill: #F59E0B; }
        </style>
        <rect width="240" height="160" fill="#F8FAFC"/>
        <rect x="20" y="20" width="200" height="30" rx="6" class="element"/>
        <rect x="20" y="60" width="200" height="30" rx="6" class="element2"/>
        <rect x="20" y="100" width="95" height="40" rx="8" class="element3"/>
        <rect x="125" y="100" width="95" height="40" rx="8" class="element2"/>
      </svg>
    `)}`,
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Campaigns",
    description: "Design and send beautiful email campaigns that convert",
    color: "bg-gradient-to-br from-violet-500 to-purple-500",
    mockImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="240" height="160" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          .element { fill: #6366F1; transition: fill 0.3s ease-in-out; }
          .element:hover { fill: #EC4899; }
          .element2 { fill: #6366F1; transition: fill 0.3s ease-in-out; }
          .element2:hover { fill: #F59E0B; }
          .element3 { fill: #6366F1; transition: fill 0.3s ease-in-out; }
          .element3:hover { fill: #8B5CF6; }
        </style>
        <rect width="240" height="160" fill="#F8FAFC"/>
        <path d="M20 40L120 100L220 40" stroke="#6366F1" stroke-width="4" class="element"/>
        <rect x="20" y="20" width="200" height="120" rx="8" stroke="#6366F1" stroke-width="4" class="element2"/>
        <circle cx="120" cy="80" r="30" class="element3"/>
      </svg>
    `)}`,
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Landing Pages",
    description: "Create stunning landing pages in minutes",
    color: "bg-gradient-to-br from-emerald-500 to-teal-500",
    mockImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="240" height="160" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          .element { fill: #6366F1; transition: fill 0.3s ease-in-out; }
          .element:hover { fill: #8B5CF6; }
          .element2 { fill: #6366F1; transition: fill 0.3s ease-in-out; }
          .element2:hover { fill: #F59E0B; }
          .element3 { fill: #6366F1; transition: fill 0.3s ease-in-out; }
          .element3:hover { fill: #EC4899; }
        </style>
        <rect width="240" height="160" fill="#F8FAFC"/>
        <rect x="20" y="20" width="200" height="40" rx="8" class="element"/>
        <rect x="20" y="70" width="95" height="70" rx="8" class="element2"/>
        <rect x="125" y="70" width="95" height="70" rx="8" class="element3"/>
      </svg>
    `)}`,
  },
];

const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16">
          {/* Main heading and logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center items-center gap-4 mb-8">
            <CubeLogo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Your Digital Presence,
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">Beautifully Managed</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              One powerful platform to manage your links, forms, emails, and landing pages. Build your online presence with confidence.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-full font-semibold text-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transition-transform group-hover:scale-105" />
              <span className="relative text-white inline-flex items-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-full font-semibold text-lg overflow-hidden border-2 border-indigo-600">
              <span className="relative bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="group relative p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />

                {/* Mock Image */}
                <div className="mb-6 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={feature.mockImage}
                    alt={feature.title}
                    className="w-full h-auto"
                    width="240"
                    height="160"
                  />
                </div>

                <div className={`w-12 h-12 ${feature.color} text-white rounded-xl flex items-center justify-center mb-4`}>{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
