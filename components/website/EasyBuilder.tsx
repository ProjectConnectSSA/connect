"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Image, Link2, Layout, Type, Mail, FormInput, Grid, Copy, Images, Send } from "lucide-react";

const builders = [
  {
    id: "link",
    title: "Link Builder",
    steps: [
      {
        id: "logo",
        icon: (
          <Image
            className="w-6 h-6"
            alt="Logo"
          />
        ),
        label: "Add your logo and profile",
        color: "bg-blue-500",
      },
      {
        id: "heading",
        icon: <Type className="w-6 h-6" />,
        label: "Add heading & bio",
        color: "bg-purple-500",
      },
      {
        id: "links",
        icon: <Link2 className="w-6 h-6" />,
        label: "Add your links & cards",
        color: "bg-pink-500",
      },
      {
        id: "layout",
        icon: <Grid className="w-6 h-6" />,
        label: "Choose grid layout",
        color: "bg-green-500",
      },
    ],
  },
  {
    id: "form",
    title: "Form Builder",
    steps: [
      {
        id: "image",
        icon: (
          <Images
            className="w-6 h-6"
            alt="Logo"
          />
        ),
        label: "Add cover image",
        color: "bg-orange-500",
      },
      {
        id: "fields",
        icon: <FormInput className="w-6 h-6" />,
        label: "Add form fields",
        color: "bg-yellow-500",
      },
      {
        id: "navigation",
        icon: <Layout className="w-6 h-6" />,
        label: "Set navigation flow",
        color: "bg-emerald-500",
      },
      {
        id: "submit",
        icon: <Send className="w-6 h-6" />,
        label: "Configure submission",
        color: "bg-cyan-500",
      },
    ],
  },
  {
    id: "email",
    title: "Email Builder",
    steps: [
      {
        id: "template",
        icon: <Layout className="w-6 h-6" />,
        label: "Choose template type",
        color: "bg-indigo-500",
      },
      {
        id: "content",
        icon: <Type className="w-6 h-6" />,
        label: "Add content & products",
        color: "bg-violet-500",
      },
      {
        id: "design",
        icon: (
          <Image
            className="w-6 h-6"
            alt="Logo"
          />
        ),
        label: "Customize design",
        color: "bg-fuchsia-500",
      },
      {
        id: "preview",
        icon: <Mail className="w-6 h-6" />,
        label: "Preview & test send",
        color: "bg-rose-500",
      },
    ],
  },
  {
    id: "landing",
    title: "Landing Page Builder",
    steps: [
      {
        id: "sections",
        icon: <Layout className="w-6 h-6" />,
        label: "Add page sections",
        color: "bg-blue-500",
      },
      {
        id: "components",
        icon: <Copy className="w-6 h-6" />,
        label: "Add components",
        color: "bg-purple-500",
      },
      {
        id: "content",
        icon: <Type className="w-6 h-6" />,
        label: "Add content & media",
        color: "bg-pink-500",
      },
      {
        id: "publish",
        icon: <Send className="w-6 h-6" />,
        label: "Publish & share",
        color: "bg-green-500",
      },
    ],
  },
];

const BUILDER_DURATION = 6000; // 6 seconds per builder type
const STEP_DURATION = 1000; // 1 second per step animation
const INITIAL_DELAY = 500; // 0.5 second initial delay

const EasyBuilder = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentBuilderIndex, setCurrentBuilderIndex] = useState(0);
  const [activeSteps, setActiveSteps] = useState<string[]>([]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Reset steps when builder changes
    setActiveSteps([]);

    // Start new builder animation sequence
    const stepTimeout = setTimeout(() => {
      const currentBuilder = builders[currentBuilderIndex];

      const stepIntervals = currentBuilder.steps.map((step, index) => {
        return setTimeout(() => {
          setActiveSteps((prev) => [...prev, step.id]);
        }, index * STEP_DURATION);
      });

      return () => {
        stepIntervals.forEach(clearTimeout);
      };
    }, INITIAL_DELAY);

    // Set up builder rotation
    const builderInterval = setInterval(() => {
      setCurrentBuilderIndex((prev) => (prev + 1) % builders.length);
      setKey((k) => k + 1);
    }, BUILDER_DURATION);

    return () => {
      clearTimeout(stepTimeout);
      clearInterval(builderInterval);
    };
  }, [inView, currentBuilderIndex]);

  const currentBuilder = builders[currentBuilderIndex];

  return (
    <section
      id="easy-builder"
      className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Easy Builder</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Build your digital presence in minutes with our intuitive drag-and-drop interface</p>
        </div>

        <div
          className="flex flex-col lg:flex-row items-start gap-12"
          ref={ref}>
          <div className="flex-1">
            <motion.h3
              key={`${currentBuilder.id}-title-${key}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-2xl font-bold text-gray-900 mb-6">
              {currentBuilder.title}
            </motion.h3>
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {currentBuilder.steps.map((step) => (
                  <motion.div
                    key={`${currentBuilder.id}-${step.id}-${key}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: activeSteps.includes(step.id) ? 1 : 0.3,
                      x: activeSteps.includes(step.id) ? 0 : -20,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: activeSteps.includes(step.id) ? 0 : 0.1,
                    }}
                    className="flex items-center gap-4">
                    <motion.div
                      className={`p-3 rounded-lg ${step.color} text-white`}
                      animate={{
                        scale: activeSteps.includes(step.id) ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 0.3,
                        times: [0, 0.5, 1],
                      }}>
                      {step.icon}
                    </motion.div>
                    <span className="text-lg text-gray-700">{step.label}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentBuilder.id}-preview-${key}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 p-8">
                  {currentBuilder.id === "link" && (
                    <div className="relative h-full">
                      {activeSteps.includes("logo") && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center gap-4 mb-6">
                          <div className="w-20 h-20 bg-blue-500 rounded-full" />
                          <div className="w-32 h-4 bg-blue-500/30 rounded" />
                        </motion.div>
                      )}

                      {activeSteps.includes("heading") && (
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="space-y-2 mb-8">
                          <div className="h-6 bg-purple-500 rounded-lg w-3/4 mx-auto" />
                          <div className="h-4 bg-purple-500/30 rounded-lg w-2/3 mx-auto" />
                        </motion.div>
                      )}

                      {activeSteps.includes("links") && (
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="grid grid-cols-2 gap-4 relative z-10">
                          {[1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="space-y-2">
                              <div className="h-24 bg-pink-500/20 rounded-lg" />
                              <div className="h-4 bg-pink-500 rounded w-2/3" />
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {activeSteps.includes("layout") && (
                        <motion.div
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.2 }}
                          className="absolute inset-4 border-4 border-green-500 rounded-lg grid grid-cols-2 gap-4"
                        />
                      )}
                    </div>
                  )}

                  {currentBuilder.id === "form" && (
                    <div className="relative h-full flex">
                      <div className="w-1/2 border-r border-gray-200 p-4">
                        {activeSteps.includes("image") && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full bg-orange-500/20 rounded-lg"
                          />
                        )}
                      </div>
                      <div className="w-1/2 p-4 space-y-4">
                        {activeSteps.includes("fields") && (
                          <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="h-8 bg-yellow-500/30 rounded-lg"
                              />
                            ))}
                          </motion.div>
                        )}

                        {activeSteps.includes("navigation") && (
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex justify-between mt-4">
                            <div className="w-20 h-8 bg-emerald-500 rounded-lg" />
                            <div className="w-20 h-8 bg-emerald-500 rounded-lg" />
                          </motion.div>
                        )}

                        {activeSteps.includes("submit") && (
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full h-10 bg-cyan-500 rounded-lg mt-4"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {currentBuilder.id === "email" && (
                    <div className="relative h-full space-y-4">
                      {activeSteps.includes("template") && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="grid grid-cols-2 gap-4">
                          <div className="h-24 bg-indigo-500/20 rounded-lg" />
                          <div className="h-24 bg-indigo-500/30 rounded-lg" />
                        </motion.div>
                      )}

                      {activeSteps.includes("content") && (
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="space-y-4">
                          <div className="h-8 bg-violet-500 rounded-lg w-3/4" />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="h-20 bg-violet-500/20 rounded-lg" />
                              <div className="h-4 bg-violet-500 rounded w-2/3" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-20 bg-violet-500/20 rounded-lg" />
                              <div className="h-4 bg-violet-500 rounded w-2/3" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeSteps.includes("design") && (
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="absolute top-4 right-4 space-y-2">
                          <div className="w-8 h-8 bg-fuchsia-500 rounded-lg" />
                          <div className="w-8 h-8 bg-fuchsia-500/70 rounded-lg" />
                          <div className="w-8 h-8 bg-fuchsia-500/40 rounded-lg" />
                        </motion.div>
                      )}

                      {activeSteps.includes("preview") && (
                        <motion.div
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute bottom-4 right-4 w-32 h-10 bg-rose-500 rounded-lg"
                        />
                      )}
                    </div>
                  )}

                  {currentBuilder.id === "landing" && (
                    <div className="relative h-full space-y-4">
                      {activeSteps.includes("sections") && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-2">
                          <div className="h-20 bg-blue-500/20 rounded-lg" />
                          <div className="h-16 bg-blue-500/30 rounded-lg" />
                          <div className="h-12 bg-blue-500/40 rounded-lg" />
                        </motion.div>
                      )}

                      {activeSteps.includes("components") && (
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="absolute left-4 inset-y-4 flex flex-col justify-center space-y-2">
                          {[1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="w-10 h-10 bg-purple-500 rounded-lg"
                            />
                          ))}
                        </motion.div>
                      )}

                      {activeSteps.includes("content") && (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="grid grid-cols-2 gap-4 mt-8 ml-16">
                          <div className="space-y-2">
                            <div className="h-4 bg-pink-500 rounded w-3/4" />
                            <div className="h-4 bg-pink-500/60 rounded w-full" />
                            <div className="h-4 bg-pink-500/30 rounded w-2/3" />
                          </div>
                          <div className="h-24 bg-pink-500/20 rounded-lg" />
                        </motion.div>
                      )}

                      {activeSteps.includes("publish") && (
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="absolute bottom-4 right-4 flex gap-2">
                          <div className="w-24 h-10 bg-green-500/30 rounded-lg" />
                          <div className="w-24 h-10 bg-green-500 rounded-lg" />
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-2 hover:bg-indigo-700 transition-colors">
            Start Building Now
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default EasyBuilder;
