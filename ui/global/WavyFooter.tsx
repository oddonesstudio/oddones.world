"use client";

import { animate, motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

import { Text } from "@/ui/atoms/Text";
import { AnimatedLogo } from "../atoms/AnimatedLogo";

type WavyFooterProps = {
  copyright?: string | null;
};

const getCopyrightText = (copyright?: string | null) => {
  const year = new Date().getFullYear().toString();
  const text = copyright?.trim() || "© Odd Ones, odd since 2026";

  if (text.includes("{year}")) {
    return text.replaceAll("{year}", year);
  }

  return `${text} ${year}.`;
};

export const WavyFooter = ({ copyright }: WavyFooterProps) => {
  const { scrollYProgress } = useScroll();
  const translateX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const scrollScale = useTransform(scrollYProgress, [0.5, 1], [0, 0.5]);
  const scaleY = useMotionValue(0);
  const footerHeight = useTransform(scaleY, (value) => `${Math.max(value, 0) * 100}vh`);
  const copyrightText = getCopyrightText(copyright);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [canScroll, setCanScroll] = useState(false);
  const [showCopyright, setShowCopyright] = useState(false);

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
    setShowCopyright(false);
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

  useEffect(() => {
    if (isTransitioning || !canScroll) {
      setShowCopyright(false);
      return;
    }

    const updateCopyrightVisibility = () => {
      const doc = document.documentElement;
      const bottomOffset = doc.scrollHeight - doc.clientHeight - doc.scrollTop;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const bottomThreshold = isMobile ? 96 : 8;

      setShowCopyright(bottomOffset <= bottomThreshold);
    };

    updateCopyrightVisibility();
    const unsubscribe = scrollYProgress.on("change", updateCopyrightVisibility);
    window.addEventListener("resize", updateCopyrightVisibility);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", updateCopyrightVisibility);
    };
  }, [canScroll, isTransitioning, scrollYProgress]);

  return (
    <footer className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatedLogo />
      <motion.svg
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
      <motion.div
        className="absolute bottom-0 left-0 w-full overflow-hidden opacity-0"
        initial={false}
        animate={{ opacity: showCopyright ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ height: footerHeight }}
      >
        <Text
          as="p"
          styleType="body-sm"
          className="absolute right-8 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] text-white/70"
        >
          {copyrightText}
        </Text>
      </motion.div>
    </footer>
  );
};
