"use client";
import { motion } from "framer-motion";
import { ArrowRight, Link, FormInput, Mail, Layout, Rocket, Zap, Star, Sparkles, BarChart3, Brain, Wand2, MessageSquare } from "lucide-react";

import CubeLogo from "./CubeLoggo";
const features = [
  {
    icon: <Link className="w-6 h-6" />,
    title: "Bio Pages",
    description: "Launch your personal brand with beautiful bio pages",
    color: "bg-gradient-to-br from-indigo-500 to-purple-500",
    launchText: "Launch Your Links",
    delay: 0.5,
  },
  {
    icon: <FormInput className="w-6 h-6" />,
    title: "Smart Forms",
    description: "Rocket-powered forms that capture leads effortlessly",
    color: "bg-gradient-to-br from-pink-500 to-rose-500",
    launchText: "Launch Your Forms",
    delay: 0.7,
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Landing Pages",
    description: "Launch stunning pages that convert visitors instantly",
    color: "bg-gradient-to-br from-emerald-500 to-teal-500",
    launchText: "Launch Your Pages",
    delay: 0.9,
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Campaigns",
    description: "Launch targeted campaigns that reach for the stars",
    color: "bg-gradient-to-br from-violet-500 to-purple-500",
    launchText: "Launch Your Campaigns",
    delay: 1.1,
  },
];

const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated star field background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              times: [0, 0.21, 0.35, 0.42, 0.5, 0.64, 0.78, 0.92, 0.96, 0.98, 1, 1],
            }}
          />
        ))}

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left side - Hero content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8">
            {/* Logo and badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/30">
                  <span className="text-indigo-300 text-sm font-medium flex items-center gap-2">
                    <Rocket className="w-4 h-4" />
                    Ready for Launch
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Launch Your
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Digital Empire</span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl text-gray-300">to the Stars</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                Four powerful engines in one mission control center. Launch bio pages, forms, landing pages, and email campaigns that reach beyond the
                stratosphere.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 rounded-full font-semibold text-lg overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative inline-flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Start Launch Sequence
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 rounded-full font-semibold text-lg border-2 border-indigo-400 text-indigo-400 hover:bg-indigo-400/10 transition-all">
                <span className="inline-flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  View Mission Demo
                </span>
              </motion.button>
            </motion.div>

            {/* Feature launch buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 gap-4 pt-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: feature.delay }}
                  whileHover={{ scale: 1.02 }}
                  className="group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-400/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 ${feature.color} text-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-white font-semibold">{feature.title}</h3>
                  </div>

                  <p className="text-gray-400 text-sm mb-3">{feature.description}</p>

                  <div className="text-indigo-400 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    <Rocket className="w-3 h-3" />
                    {feature.launchText}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          {/* Left side - Hero content */}

          {/* Right side - AI-Powered Service Demonstrations */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              {/* Central Rocket with AI Brain */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                className="relative z-20 flex items-center justify-center mb-8">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 1, -1, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    times: [0, 0.42, 0.48, 0.53, 0.57, 0.61, 0.71, 0.82, 0.85, 0.89, 1, 1],
                  }}
                  className="relative">
                  {/* Main Rocket Container */}
                  <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border border-indigo-400/30">
                    <Rocket className="w-12 h-12 text-white" />

                    {/* AI Brain indicator */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 7,
                        repeat: Infinity,
                        times: [0, 0.82, 0.85, 0.89, 0.92, 0.95, 0.97, 1, 1, 1, 1, 1],
                      }}>
                      <Brain className="w-4 h-4 text-white" />
                    </motion.div>

                    {/* Pulsing rings */}
                    <motion.div
                      animate={{
                        scale: [1, 2, 1],
                        opacity: [0.6, 0, 0.6],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: 0,
                      }}
                      className="absolute inset-0 border-2 border-indigo-400 rounded-2xl"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* AI Prompt Bubble - Moved much higher to avoid all overlaps */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -top-48 left-[35%] transform -translate-x-1/2 z-30">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-indigo-200 min-w-[340px] max-w-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Wand2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-gray-800">AI Command Center</span>
                  </div>

                  {/* Typing and deleting animation for prompts */}
                  <div className="space-y-2">
                    <div className="relative min-h-[16px] h-5">
                      {/* All prompts stacked absolutely, only one visible at a time */}
                      <motion.div
                        style={{ position: "absolute", left: 0, right: 0, top: 0 }}
                        animate={{
                          opacity: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                        }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          times: [0, 0.15, 0.25, 0.3, 0.35, 0.5, 0.65, 0.8, 0.9, 0.95, 1, 1],
                        }}
                        className="text-xs text-gray-600 min-h-[16px]">
                        <motion.span
                          animate={{
                            width: ["0ch", "35ch", "35ch", "0ch"],
                          }}
                          transition={{
                            duration: 7,
                            repeat: Infinity,
                            times: [0, 0.21, 0.35, 0.42],
                            ease: "easeInOut",
                          }}
                          className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-indigo-500">
                          "Create a bio page with social links..."
                        </motion.span>
                      </motion.div>
                      <motion.div
                        style={{ position: "absolute", left: 0, right: 0, top: 0 }}
                        animate={{
                          opacity: [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                        }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          times: [0, 0.35, 0.4, 0.45, 0.5, 0.55, 0.65, 0.75, 0.8, 0.85, 1, 1],
                        }}
                        className="text-xs text-gray-600 min-h-[16px]">
                        <motion.span
                          animate={{
                            width: ["0ch", "0ch", "32ch", "32ch", "0ch"],
                          }}
                          transition={{
                            duration: 7,
                            repeat: Infinity,
                            times: [0, 0.57, 0.71, 0.82, 0.89],
                            ease: "easeInOut",
                          }}
                          className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-indigo-500">
                          "Build a contact form for startup..."
                        </motion.span>
                      </motion.div>
                      <motion.div
                        style={{ position: "absolute", left: 0, right: 0, top: 0 }}
                        animate={{
                          opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
                        }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          times: [0, 0.8, 0.82, 0.85, 0.87, 0.9, 0.92, 0.95, 0.97, 1, 1, 1],
                        }}
                        className="text-xs text-gray-600 min-h-[16px]">
                        <motion.span
                          animate={{
                            width: ["0ch", "0ch", "38ch", "38ch"],
                          }}
                          transition={{
                            duration: 7,
                            repeat: Infinity,
                            times: [0, 0.92, 1, 1],
                            ease: "easeInOut",
                          }}
                          className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-indigo-500">
                          "Design email campaign for product launch..."
                        </motion.span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Service Demonstration Animations */}

              {/* 1. Bio Page/Links Animation - Top Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute top-16 left-4 z-20 mt-4">
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                  className="w-28 h-34 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-indigo-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Link className="w-3 h-3 text-indigo-600" />
                    </motion.div>
                    <span className="text-xs font-bold text-gray-800">Bio Page</span>
                  </div>

                  {/* Profile avatar animation */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      backgroundColor: ["#e0e7ff", "#c7d2fe", "#e0e7ff"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="w-8 h-8 bg-indigo-100 rounded-full mb-2 mx-auto"
                  />

                  {/* Animated social links building */}
                  {[
                    { color: "bg-indigo-400", width: "100%", delay: 2 },
                    { color: "bg-purple-400", width: "90%", delay: 2.3 },
                    { color: "bg-pink-400", width: "80%", delay: 2.6 },
                    { color: "bg-rose-400", width: "95%", delay: 2.9 },
                  ].map((link, index) => (
                    <motion.div
                      key={index}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: link.width, opacity: 1 }}
                      transition={{
                        delay: link.delay,
                        duration: 0.8,
                        repeat: Infinity,
                        repeatDelay: 4,
                      }}
                      className={`h-2 ${link.color} rounded-full mb-1.5 shadow-sm`}
                    />
                  ))}

                  {/* Click counter */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 3.5 }}
                    className="text-xs text-center text-indigo-600 font-semibold mt-1">
                    +47 clicks
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* 2. Landing Page Animation - Far Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
                className="absolute top-20 right-[-20px] z-20 mt-2">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 2.5,
                  }}
                  className="w-36 h-28 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-teal-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 8, -8, 0],
                      }}
                      transition={{ duration: 2.8, repeat: Infinity }}
                      className="w-4 h-4 bg-teal-100 rounded flex items-center justify-center">
                      <Layout className="w-3 h-3 text-teal-600" />
                    </motion.div>
                    <span className="text-xs font-bold text-gray-800">Landing Page</span>
                  </div>

                  {/* Page header/hero section */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 8, opacity: 1 }}
                    transition={{
                      delay: 4,
                      duration: 0.8,
                      repeat: Infinity,
                      repeatDelay: 5,
                    }}
                    className="bg-gradient-to-r from-teal-200 to-teal-300 rounded mb-2"
                  />

                  {/* Content sections building */}
                  <div className="flex gap-1 mb-2">
                    <motion.div
                      initial={{ width: 0, height: 0 }}
                      animate={{ width: 16, height: 6 }}
                      transition={{
                        delay: 4.5,
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 5,
                      }}
                      className="bg-teal-400 rounded"
                    />

                    <motion.div
                      initial={{ width: 0, height: 0 }}
                      animate={{ width: 16, height: 6 }}
                      transition={{
                        delay: 5,
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 5,
                      }}
                      className="bg-teal-500 rounded"
                    />
                  </div>

                  {/* CTA section */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 5.5,
                      duration: 0.4,
                      repeat: Infinity,
                      repeatDelay: 5,
                    }}
                    className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded shadow-sm"
                  />

                  {/* Conversion indicator */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 6 }}
                    className="absolute top-2 right-2 text-xs text-teal-600 font-bold">
                    🎯 85%
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* 3. Form Builder Animation - Bottom Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.5, duration: 0.6 }}
                className="absolute bottom-16 left-2 z-20 ">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, -1, 1, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: 1.5,
                  }}
                  className="w-30 h-36 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-pink-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="w-4 h-4 bg-pink-100 rounded flex items-center justify-center">
                      <FormInput className="w-3 h-3 text-pink-600" />
                    </motion.div>
                    <span className="text-xs font-bold text-gray-800">Smart Form</span>
                  </div>

                  {/* Form header */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{
                      delay: 3,
                      duration: 0.8,
                      repeat: Infinity,
                      repeatDelay: 8,
                    }}
                    className="h-2 bg-pink-300 rounded mb-2"
                  />

                  {/* Text input fields */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "90%" }}
                    transition={{
                      delay: 3.5,
                      duration: 0.8,
                      repeat: Infinity,
                      repeatDelay: 8,
                    }}
                    className="h-2 bg-pink-400 rounded mb-2"
                  />

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{
                      delay: 4,
                      duration: 0.8,
                      repeat: Infinity,
                      repeatDelay: 8,
                    }}
                    className="h-2 bg-pink-400 rounded mb-2"
                  />

                  {/* Image upload element */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 4.5,
                      duration: 0.6,
                      repeat: Infinity,
                      repeatDelay: 8,
                    }}
                    className="w-full h-4 bg-gradient-to-r from-pink-200 to-pink-300 rounded-lg mb-2 flex items-center justify-center border-2 border-dashed border-pink-400">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 5 }}
                      className="w-2 h-2 bg-pink-500 rounded flex items-center justify-center">
                      <span className="text-xs text-white">📷</span>
                    </motion.div>
                  </motion.div>

                  {/* Checkbox animation */}
                  <div className="flex gap-1 mb-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 5.2,
                        duration: 0.3,
                        repeat: Infinity,
                        repeatDelay: 8,
                      }}
                      className="w-2 h-2 bg-pink-500 rounded-sm"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{
                        delay: 5.4,
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 8,
                      }}
                      className="h-2 bg-pink-300 rounded"
                    />
                  </div>

                  {/* Submit button */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 6,
                      duration: 0.4,
                      repeat: Infinity,
                      repeatDelay: 8,
                    }}
                    className="h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded shadow-sm"
                  />

                  {/* Success indicator */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 6.5,
                      duration: 0.3,
                      repeat: Infinity,
                      repeatDelay: 8,
                    }}
                    className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">✓</span>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* 4. Email Campaign Animation - Bottom Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3, duration: 0.6 }}
                className="absolute bottom-12 right-4 z-20 ">
                <motion.div
                  animate={{
                    y: [0, -7, 0],
                    scale: [1, 1.01, 1],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    delay: 2,
                  }}
                  className="w-32 h-32 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-violet-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, -15, 0],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-4 h-4 bg-violet-100 rounded flex items-center justify-center">
                      <Mail className="w-3 h-3 text-violet-600" />
                    </motion.div>
                    <span className="text-xs font-bold text-gray-800">Email Campaign</span>
                  </div>

                  {/* Email template preview */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 20, opacity: 1 }}
                    transition={{
                      delay: 3.5,
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 6,
                    }}
                    className="bg-gradient-to-br from-violet-50 to-violet-100 rounded mb-2 overflow-hidden border border-violet-200">
                    {/* Email header */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{
                        delay: 4,
                        duration: 0.8,
                        repeat: Infinity,
                        repeatDelay: 6,
                      }}
                      className="h-1 bg-violet-400 mb-1"
                    />

                    {/* Email content lines */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "90%" }}
                      transition={{
                        delay: 4.3,
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 6,
                      }}
                      className="h-1 bg-violet-300 mb-1 ml-1"
                    />

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{
                        delay: 4.6,
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 6,
                      }}
                      className="h-1 bg-violet-300 mb-1 ml-1"
                    />

                    {/* CTA button */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 4.9,
                        duration: 0.4,
                        repeat: Infinity,
                        repeatDelay: 6,
                      }}
                      className="w-8 h-2 bg-violet-500 rounded mx-auto mt-1"
                    />
                  </motion.div>

                  {/* Send animation with counter */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 5.5,
                      duration: 0.3,
                      repeat: Infinity,
                      repeatDelay: 6,
                    }}
                    className="flex items-center justify-between">
                    <span className="text-xs text-violet-600 font-semibold">Sent: 1,247</span>
                    <motion.div
                      animate={{
                        x: [0, 15, 0],
                        opacity: [1, 0.3, 1],
                      }}
                      transition={{
                        delay: 5.8,
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 6,
                      }}
                      className="w-4 h-2 bg-violet-500 rounded-full"
                    />
                  </motion.div>

                  {/* Open rate indicator */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      color: ["#7c3aed", "#8b5cf6", "#7c3aed"],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 6 }}
                    className="absolute top-2 right-2 text-xs text-violet-600 font-bold">
                    42% ↗
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* 5. Multi-Service Analytics Dashboard - Much Further Bottom */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.5, duration: 0.6 }}
                className="absolute bottom-[-240px] left-[35%] transform -translate-x-1/2 z-20">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 2.5,
                  }}
                  className="w-64 h-40 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-emerald-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-4 h-4 bg-emerald-100 rounded flex items-center justify-center">
                      <BarChart3 className="w-3 h-3 text-emerald-600" />
                    </motion.div>
                    <span className="text-xs font-bold text-gray-800">Analytics</span>
                  </div>

                  {/* Single Service Analytics - Rotating Display */}
                  <div className="space-y-2 mb-2 relative h-24">
                    {/* Bio Pages Analytics (0-3s) */}
                    <motion.div
                      animate={{
                        opacity: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        scale: [1, 1.02, 1, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        times: [0, 0.15, 0.2, 0.25, 0.5, 0.75, 1, 1, 1, 1, 1, 1],
                      }}
                      className="space-y-1 absolute top-0 left-0 w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-indigo-600">Bio Pages</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Clicks:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-indigo-600 font-semibold">
                            2,847
                          </motion.span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">CTR:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-indigo-600 font-semibold">
                            4.2%
                          </motion.span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Views:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-indigo-600 font-semibold">
                            68k
                          </motion.span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shares:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-indigo-600 font-semibold">
                            1,245
                          </motion.span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-indigo-200 rounded overflow-hidden">
                        <motion.div
                          animate={{ width: ["0%", "78%"] }}
                          transition={{ delay: 1.8, duration: 1 }}
                          className="h-full bg-indigo-400 rounded"
                        />
                      </div>
                    </motion.div>

                    {/* Forms Analytics (3-6s) */}
                    <motion.div
                      animate={{
                        opacity: [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                        scale: [0.95, 0.95, 0.95, 1, 1.02, 1, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        times: [0, 0.2, 0.24, 0.25, 0.4, 0.45, 0.5, 0.75, 1, 1, 1, 1],
                      }}
                      className="space-y-1 absolute top-0 left-0 w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-pink-600">Smart Forms</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Submissions:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-pink-600 font-semibold">
                            1,923
                          </motion.span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rate:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-pink-600 font-semibold">
                            92%
                          </motion.span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Leads:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-pink-600 font-semibold">
                            1,847
                          </motion.span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quality:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-pink-600 font-semibold">
                            A+
                          </motion.span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-pink-200 rounded overflow-hidden">
                        <motion.div
                          animate={{ width: ["0%", "0%", "0%", "0%", "92%"] }}
                          transition={{ delay: 4.8, duration: 1, repeat: Infinity, repeatDelay: 7 }}
                          className="h-full bg-pink-400 rounded"
                        />
                      </div>
                    </motion.div>

                    {/* Email Analytics (6-9s) */}
                    <motion.div
                      animate={{
                        opacity: [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
                        scale: [0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 1, 1.02, 1, 0.95, 0.95, 0.95],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        times: [0, 0.45, 0.49, 0.5, 0.5, 0.5, 0.5, 0.65, 0.7, 0.75, 1, 1],
                      }}
                      className="space-y-1 absolute top-0 left-0 w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-violet-600">Email Campaigns</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sent:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-violet-600 font-semibold">
                            15.2k
                          </motion.span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Opens:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-violet-600 font-semibold">
                            42%
                          </motion.span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Clicks:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-violet-600 font-semibold">
                            8.7%
                          </motion.span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-violet-200 rounded overflow-hidden">
                        <motion.div
                          animate={{ width: ["0%", "0%", "0%", "0%", "0%", "0%", "0%", "85%"] }}
                          transition={{ delay: 7.8, duration: 1, repeat: Infinity, repeatDelay: 4 }}
                          className="h-full bg-violet-400 rounded"
                        />
                      </div>
                    </motion.div>

                    {/* Landing Pages Analytics (9-12s) */}
                    <motion.div
                      animate={{
                        opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
                        scale: [0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 1, 1.02, 1],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        times: [0, 0.7, 0.74, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.9, 1],
                      }}
                      className="space-y-1 absolute top-0 left-0 w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-teal-600">Landing Pages</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Visitors:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-teal-600 font-semibold">
                            45.7k
                          </motion.span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Conversion:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-teal-600 font-semibold">
                            96%
                          </motion.span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bounce:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-teal-600 font-semibold">
                            12%
                          </motion.span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Speed:</span>
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="text-teal-600 font-semibold">
                            0.8s
                          </motion.span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-teal-200 rounded overflow-hidden">
                        <motion.div
                          animate={{ width: ["0%", "0%", "0%", "0%", "0%", "0%", "0%", "0%", "0%", "0%", "96%"] }}
                          transition={{ delay: 10.8, duration: 1, repeat: Infinity, repeatDelay: 1 }}
                          className="h-full bg-teal-400 rounded"
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Current Service Indicator */}
                  <motion.div
                    animate={{
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-xs text-center text-emerald-600 font-bold mt-1">
                    <motion.span
                      animate={{
                        color: [
                          "#6366F1",
                          "#6366F1",
                          "#6366F1",
                          "#EC4899",
                          "#EC4899",
                          "#EC4899",
                          "#8B5CF6",
                          "#8B5CF6",
                          "#8B5CF6",
                          "#10B981",
                          "#10B981",
                          "#10B981",
                        ],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        times: [0, 0.2, 0.25, 0.25, 0.45, 0.5, 0.5, 0.7, 0.75, 0.75, 0.95, 1],
                      }}></motion.span>
                  </motion.div>

                  {/* Live indicator */}
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"
                  />
                </motion.div>
              </motion.div>

              {/* Connecting AI Lines */}
              <svg
                className="absolute inset-0 w-full h-full z-10"
                viewBox="0 0 400 400">
                {/* Lines from central rocket to each service */}
                {[
                  { x1: 200, y1: 120, x2: 80, y2: 160, delay: 1.5 }, // Bio Page
                  { x1: 200, y1: 120, x2: 320, y2: 140, delay: 2 }, // Analytics
                  { x1: 200, y1: 120, x2: 60, y2: 300, delay: 2.5 }, // Form
                  { x1: 200, y1: 120, x2: 340, y2: 290, delay: 3 }, // Email
                  { x1: 200, y1: 120, x2: 200, y2: 320, delay: 3.5 }, // Landing
                ].map((line, index) => (
                  <motion.line
                    key={index}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{
                      delay: line.delay,
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 4,
                    }}
                  />
                ))}

                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%">
                    <stop
                      offset="0%"
                      stopColor="#6366F1"
                      stopOpacity="0.8"
                    />
                    <stop
                      offset="50%"
                      stopColor="#8B5CF6"
                      stopOpacity="0.6"
                    />
                    <stop
                      offset="100%"
                      stopColor="#EC4899"
                      stopOpacity="0.4"
                    />
                  </linearGradient>
                </defs>
              </svg>

              {/* AI Status Display */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4 }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-center">
                <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg p-3 border border-indigo-400/30">
                  <div className="text-indigo-400 text-sm font-mono mb-1">AI SYSTEMS</div>
                  <div className="text-green-400 text-sm font-bold flex items-center gap-2 justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    />
                    Preparing Your Launch
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
