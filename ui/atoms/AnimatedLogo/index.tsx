"use client";

import { motion } from "framer-motion";

import { Z_INDEX_CLASS } from "@/app/constants/ui";
import { Logo } from "@/ui/_assets/Logo";
import { cn } from "@/ui/_lib/utils";

export const AnimatedLogo = () => (
  <motion.div
    className={cn(
      Z_INDEX_CLASS.localBase,
      "absolute top-1/2 left-1/2 -translate-1/2 bg-page-background p-1 pb-2",
    )}
    initial="start"
    animate="animate"
    variants={{
      start: { scale: 1, rotate: 0, opacity: 1 },
      animate: {
        scale: [1, 1.5, 2, 2.5, 3],
        rotate: [0, -12, 12, -12, 0],
        opacity: 0,
        transition: {
          scale: { duration: 0.8 },
          rotate: { duration: 0.8 },
          opacity: { delay: 0.8, duration: 0.2 },
        },
      },
    }}
  >
    <Logo />
  </motion.div>
);
