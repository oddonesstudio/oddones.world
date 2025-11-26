import { motion, useScroll, useTransform } from "framer-motion";

import { AnimatedLogo } from "./AnimatedLogo";

export const WavyFooter = () => {
  const { scrollYProgress } = useScroll();
  const translateX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const height = useTransform(scrollYProgress, [0.5, 1], ["0%", "50%"]);

  return (
    <footer className="pointer-events-none fixed inset-0 z-40">
      <AnimatedLogo />
      <motion.svg
        id="svgWave"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 2048 44.4"
        preserveAspectRatio="none"
        style={{ translateX, height }}
        className="absolute bottom-0"
        initial={{ height: "200%" }}
        animate={{ height: "0%" }}
        transition={{ delay: 1 }}
      >
        <title>Wavy Footer</title>
        <path d="M0,11.8 C0,11.8 146.3,22.4 274,22.4 C440.4,22.4 801.1,0 801.1,0 C947.4,0 1024.1,11.8 1024.1,11.8 C1024.1,11.8 1098.1,22.4 1298.1,22.4 C1478.1,22.4 1825.1,0 1825.1,0 C1971.4,0 2048,11.8 2048,11.8 L2048,44.4 L0,44.4 Z" />
      </motion.svg>
    </footer>
  );
};
