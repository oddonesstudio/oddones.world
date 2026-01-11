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
  const scrollHeight = useTransform(scrollYProgress, [0.5, 1], ["0%", "50%"]);
  const height = useMotionValue("0%");
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

    height.set(scrollHeight.get());
    const unsubscribe = scrollHeight.on("change", (value) => height.set(value));
    return () => unsubscribe();
  }, [canScroll, height, isTransitioning, scrollHeight]);

  useEffect(() => {
    if (!canScroll && !isTransitioning) {
      height.set("0%");
    }
  }, [canScroll, height, isTransitioning]);

  useEffect(() => {
    setIsTransitioning(true);
    height.set("200%");

    const controls = animate(height, "0%", {
      duration: 1,
      delay: 1,
      ease: "easeInOut",
      onComplete: () => {
        setIsTransitioning(false);
        if (canScroll) {
          height.set(scrollHeight.get());
        } else {
          height.set("0%");
        }
      },
    });

    return () => controls.stop();
  }, [canScroll, height, scrollHeight]);

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
        style={{ translateX, height }}
        className="absolute bottom-0 left-0 w-[200%]"
        initial={{ height: "200%" }}
        animate={{ height: "0%" }}
        transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
      >
        <title>Wavy Footer</title>
        <path d="M0,12 C128,9 256,9 384,12 S640,15 768,12 S1024,9 1152,12 S1408,15 1536,12 S1792,9 1920,12 C1984,13 2048,13 2048,13 L2048,44.4 L0,44.4 Z" />
      </motion.svg>
    </footer>
  );
};
