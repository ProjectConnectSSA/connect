"use client";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";

const showcaseItems = [
  {
    title: "Beautiful Landing Pages",
    description: "Create stunning landing pages in minutes with our drag-and-drop builder",
    image: `data:image/svg+xml,${encodeURIComponent(`
    <svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#F8FAFC"/>
      <!-- Navigation -->
      <rect x="40" y="20" width="720" height="60" rx="8" fill="white" stroke="#E2E8F0"/>
      <circle cx="80" cy="50" r="20" fill="#6366F1"/>
      <rect x="120" y="40" width="100" height="20" rx="4" fill="#E2E8F0"/>
      <rect x="560" y="35" width="160" height="30" rx="15" fill="#6366F1"/>
      
      <!-- Hero Section -->
      <rect x="40" y="100" width="720" height="200" rx="8" fill="white" stroke="#E2E8F0"/>
      <rect x="80" y="130" width="300" height="40" rx="4" fill="#6366F1"/>
      <rect x="80" y="180" width="260" height="20" rx="4" fill="#E2E8F0"/>
      <rect x="80" y="210" width="260" height="20" rx="4" fill="#E2E8F0"/>
      <rect x="80" y="250" width="120" height="30" rx="15" fill="#6366F1"/>
      <rect x="440" y="120" width="280" height="160" rx="8" fill="#E2E8F0"/>
      
      <!-- Features Grid -->
      <rect x="40" y="320" width="350" height="120" rx="8" fill="white" stroke="#E2E8F0"/>
      <rect x="410" y="320" width="350" height="120" rx="8" fill="white" stroke="#E2E8F0"/>
      <rect x="40" y="460" width="350" height="120" rx="8" fill="white" stroke="#E2E8F0"/>
      <rect x="410" y="460" width="350" height="120" rx="8" fill="white" stroke="#E2E8F0"/>
      
      <!-- Feature Content -->
      <circle cx="80" cy="360" r="20" fill="#6366F1"/>
      <rect x="120" y="350" width="200" height="20" rx="4" fill="#E2E8F0"/>
      <rect x="120" y="380" width="240" height="40" rx="4" fill="#E2E8F0"/>
    </svg>
    `)}`,
  },
  {
    title: "Professional Email Campaigns",
    description: "Design and send beautiful email campaigns that convert",
    image: `data:image/svg+xml,${encodeURIComponent(`
    <svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#F8FAFC"/>
      <!-- Email Editor -->
      <rect x="40" y="20" width="500" height="560" rx="8" fill="white" stroke="#E2E8F0"/>
      
      <!-- Toolbar -->
      <rect x="60" y="40" width="460" height="40" rx="4" fill="#6366F1"/>
      <circle cx="85" cy="60" r="10" fill="white"/>
      <circle cx="115" cy="60" r="10" fill="white"/>
      <circle cx="145" cy="60" r="10" fill="white"/>
      
      <!-- Email Content -->
      <rect x="60" y="100" width="460" height="200" rx="4" fill="#E2E8F0"/>
      <rect x="60" y="320" width="460" height="100" rx="4" fill="#E2E8F0"/>
      <rect x="60" y="440" width="460" height="120" rx="4" fill="#E2E8F0"/>
      
      <!-- Sidebar -->
      <rect x="560" y="20" width="200" height="560" rx="8" fill="white" stroke="#E2E8F0"/>
      <rect x="580" y="40" width="160" height="40" rx="4" fill="#E2E8F0"/>
      <rect x="580" y="100" width="160" height="40" rx="4" fill="#E2E8F0"/>
      <rect x="580" y="160" width="160" height="40" rx="4" fill="#E2E8F0"/>
      <rect x="580" y="220" width="160" height="40" rx="4" fill="#6366F1"/>
    </svg>
    `)}`,
  },
  {
    title: "Smart Link Management",
    description: "Organize and track all your links with powerful analytics",
    image: `data:image/svg+xml,${encodeURIComponent(`
    <svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#F8FAFC"/>
      <!-- Dashboard Header -->
      <rect x="40" y="20" width="720" height="80" rx="8" fill="white" stroke="#E2E8F0"/>
      <circle cx="80" cy="60" r="20" fill="#6366F1"/>
      <rect x="120" y="50" width="200" height="20" rx="4" fill="#E2E8F0"/>
      <rect x="560" y="45" width="160" height="30" rx="15" fill="#6366F1"/>
      
      <!-- Analytics Grid -->
      <rect x="40" y="120" width="350" height="200" rx="8" fill="white" stroke="#E2E8F0"/>
      <rect x="410" y="120" width="350" height="200" rx="8" fill="white" stroke="#E2E8F0"/>
      
      <!-- Charts -->
      <rect x="60" y="140" width="310" height="160" rx="4" fill="#E2E8F0"/>
      <path d="M60 280 Q140 200 210 240 T370 180" stroke="#6366F1" stroke-width="3" fill="none"/>
      
      <!-- Link List -->
      <rect x="40" y="340" width="720" height="240" rx="8" fill="white" stroke="#E2E8F0"/>
      <rect x="60" y="360" width="680" height="50" rx="4" fill="#E2E8F0"/>
      <rect x="60" y="420" width="680" height="50" rx="4" fill="#E2E8F0"/>
      <rect x="60" y="480" width="680" height="50" rx="4" fill="#E2E8F0"/>
    </svg>
    `)}`,
  },
];

const SLIDE_DURATION = 5000; // 5 seconds per slide

const ProductShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % showcaseItems.length;
        setKey((prev) => prev + 1);
        return newIndex;
      });
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [inView]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    const newIndex = (currentIndex + newDirection + showcaseItems.length) % showcaseItems.length;
    setCurrentIndex(newIndex);
    setKey((prev) => prev + 1);
  };

  return (
    <section
      id="showcase"
      className="py-20 bg-gray-50">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        ref={ref}>
        {/* Content container with fixed height and overflow hidden */}
        <div className="relative h-[600px] overflow-hidden">
          <AnimatePresence
            initial={false}
            custom={currentIndex}
            mode="wait">
            <motion.div
              key={currentIndex}
              custom={currentIndex}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 w-full">
              <div className="flex flex-col lg:flex-row items-center gap-12 h-full">
                <div className="flex-1 text-center lg:text-left">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-gray-900 mb-6">
                    {showcaseItems[currentIndex].title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-gray-600 mb-8">
                    {showcaseItems[currentIndex].description}
                  </motion.p>

                  <div className="flex flex-col gap-4 mt-8">
                    <div className="flex justify-center lg:justify-start gap-2">
                      {showcaseItems.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentIndex(index);
                            setKey((prev) => prev + 1);
                          }}
                          className={`w-12 h-1 rounded-full transition-colors ${index === currentIndex ? "bg-indigo-600" : "bg-gray-300"}`}
                        />
                      ))}
                    </div>

                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        key={key}
                        className="h-full bg-indigo-600"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: SLIDE_DURATION / 1000,
                          ease: "linear",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-600 rounded-2xl transform rotate-3" />
                    <img
                      src={showcaseItems[currentIndex].image}
                      alt={showcaseItems[currentIndex].title}
                      className="relative z-10 rounded-2xl shadow-xl transform -rotate-3 transition-transform hover:rotate-0 duration-300"
                      width="800"
                      height="600"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
