import { motion } from "framer-motion";
import { FileText, Layout, Mail, LayoutDashboard } from "lucide-react";

const CubeLogo = () => {
  const cubeSize = 80;
  const spacing = 100;

  const cubeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  const cube2Variants = {
    hidden: { x: 0, opacity: 0 },
    visible: { x: spacing, opacity: 1 },
  };

  const cube3Variants = {
    hidden: { y: 0, opacity: 0 },
    visible: { y: spacing, opacity: 1 },
  };

  const cube4Variants = {
    hidden: { x: 0, opacity: 0 },
    visible: { x: -spacing, opacity: 1 },
  };

  const transitionProps = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
    repeatDelay: 1,
  };

  return (
    <div
      className="relative w-[300px] h-[300px]"
      style={{ perspective: "1000px" }}>
      {/* Cube 1 - Link Management */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial="hidden"
        animate="visible"
        variants={cubeVariants}
        transition={{ ...transitionProps }}>
        <div className={`w-[${cubeSize}px] h-[${cubeSize}px] bg-blue-500 rounded-lg shadow-lg flex items-center justify-center text-white`}>
          <FileText size={36} />
        </div>
      </motion.div>

      {/* Cube 2 - Forms Builder */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial="hidden"
        animate="visible"
        variants={cube2Variants}
        transition={{ ...transitionProps, delay: 0.5 }}>
        <div className={`w-[${cubeSize}px] h-[${cubeSize}px] bg-green-500 rounded-lg shadow-lg flex items-center justify-center text-white`}>
          <LayoutDashboard size={36} />
        </div>
      </motion.div>

      {/* Cube 3 - Email Template */}
      <motion.div
        className="absolute left-[calc(50%+100px)] top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial="hidden"
        animate="visible"
        variants={cube3Variants}
        transition={{ ...transitionProps, delay: 1 }}>
        <div className={`w-[${cubeSize}px] h-[${cubeSize}px] bg-purple-500 rounded-lg shadow-lg flex items-center justify-center text-white`}>
          <Mail size={36} />
        </div>
      </motion.div>

      {/* Cube 4 - Landing Page */}
      <motion.div
        className="absolute left-[calc(50%+100px)] top-[calc(50%+100px)] -translate-x-1/2 -translate-y-1/2"
        initial="hidden"
        animate="visible"
        variants={cube4Variants}
        transition={{ ...transitionProps, delay: 1.5 }}>
        <div className={`w-[${cubeSize}px] h-[${cubeSize}px] bg-orange-500 rounded-lg shadow-lg flex items-center justify-center text-white`}>
          <Layout size={36} />
        </div>
      </motion.div>
    </div>
  );
};

export default CubeLogo;
