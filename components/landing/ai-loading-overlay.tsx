// filepath: c:\Users\encodedCoder\Desktop\connect\components\ai-loading-overlay.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AILoadingOverlay({ isVisible }: { isVisible: boolean }) {
  const [loadingText, setLoadingText] = useState("Crafting your landing page");

  // Cycle through different loading messages
  useEffect(() => {
    if (!isVisible) return;

    const messages = [
      "Crafting your landing page",
      "Designing stunning sections",
      "Creating compelling copy",
      "Selecting beautiful images",
      "Finalizing your template",
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingText(messages[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center p-8 max-w-md">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
          className="mx-auto mb-8"
        >
          <div className="w-16 h-16 relative mx-auto">
            <Sparkles className="w-16 h-16 text-primary" />
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        <motion.h3
          className="text-xl font-bold text-white mb-3"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          {loadingText}
        </motion.h3>

        <p className="text-gray-300 text-sm">
          Our AI is designing a unique landing page based on your description
        </p>
      </div>
    </motion.div>
  );
}
