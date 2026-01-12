"use client";

import { animate, motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

import { AnimatedLogo } from "./AnimatedLogo";

interface WavyFooterProps {
  pathname: string;
}

export const WavyFooter = ({ pathname }: WavyFooterProps) => {
  const { scrollYProgress } = useScroll();
  const translateX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const scrollScale = useTransform(scrollYProgress, [0.5, 1], [0, 0.5]);
  const scaleY = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const doc = document.documentElement;
    if (!doc) return;

    const updateScrollable = () => {
      const scrollable = doc.scrollHeight - doc.clientHeight > 4;
      setCanScroll(scrollable);
    };

    updateScrollable();

    const observer = new ResizeObserver(updateScrollable);
    if (document.body) observer.observe(document.body);

    window.addEventListener("resize", updateScrollable);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollable);
    };
  }, []);

  useEffect(() => {
    if (isTransitioning || !canScroll) return;

    scaleY.set(scrollScale.get());
    const unsubscribe = scrollScale.on("change", (value) => scaleY.set(value));
    return () => unsubscribe();
  }, [canScroll, isTransitioning, scaleY, scrollScale]);

  useEffect(() => {
    if (!canScroll && !isTransitioning) {
      scaleY.set(0);
    }
  }, [canScroll, isTransitioning, scaleY]);

  useEffect(() => {
    setIsTransitioning(true);
    scaleY.set(2);

    const controls = animate(scaleY, 0, {
      duration: 1,
      delay: 1,
      ease: "easeInOut",
      onComplete: () => {
        setIsTransitioning(false);
        if (canScroll) {
          scaleY.set(scrollScale.get());
        } else {
          scaleY.set(0);
        }
      },
    });

    return () => controls.stop();
  }, [canScroll, scaleY, scrollScale]);

  return (
    <footer className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <AnimatedLogo key={`${pathname}-logo`} />
      <motion.svg
        key={`${pathname}-wave-footer`}
        id="svgWave"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 2048 44.4"
        preserveAspectRatio="none"
        style={{ translateX, scaleY, transformOrigin: "bottom", willChange: "transform" }}
        className="absolute bottom-0 left-0 h-full w-[200%]"
        initial={{ scaleY: 2 }}
        animate={{ scaleY: 0 }}
        transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
      >
        <title>Wavy Footer</title>
        <path d="M0,12 C128,9 256,9 384,12 S640,15 768,12 S1024,9 1152,12 S1408,15 1536,12 S1792,9 1920,12 C1984,13 2048,13 2048,13 L2048,44.4 L0,44.4 Z" />
      </motion.svg>
    </footer>
  );
};
