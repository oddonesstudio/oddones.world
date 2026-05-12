"use client";

import { animate, motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

import { Z_INDEX_CLASS } from "@/app/constants/ui";
import { Text } from "@/ui/atoms/Text";
import { AnimatedLogo } from "../atoms/AnimatedLogo";

type WavyFooterProps = {
  copyright?: string | null;
};

const MAX_SCROLL_FOOTER_SCALE = 0.5;
const TRANSITION_DELAY_SECONDS = 1;
const TRANSITION_DURATION_SECONDS = 1;
const SAFARI_GAP_COVER_EXIT_LEAD_SECONDS = 0.18;

const getCopyrightText = (copyright?: string | null) => {
  const year = new Date().getFullYear().toString();
  const text = copyright?.trim() || "© Odd Ones, odd since 2026";

  if (text.includes("{year}")) {
    return text.replaceAll("{year}", year);
  }

  return `${text} ${year}.`;
};

const getScrollFooterScale = () => {
  if (typeof document === "undefined") return 0;

  const doc = document.documentElement;
  const bottomOffset = doc.scrollHeight - doc.clientHeight - doc.scrollTop;
  const revealDistance = doc.clientHeight * MAX_SCROLL_FOOTER_SCALE;
  const revealProgress = (revealDistance - bottomOffset) / revealDistance;

  return Math.max(0, Math.min(MAX_SCROLL_FOOTER_SCALE, revealProgress * MAX_SCROLL_FOOTER_SCALE));
};

export const WavyFooter = ({ copyright }: WavyFooterProps) => {
  const { scrollYProgress } = useScroll();
  const translateX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const scaleY = useMotionValue(0);
  const footerHeight = useTransform(scaleY, (value) => `${Math.max(value, 0) * 100}dvh`);
  const copyrightText = getCopyrightText(copyright);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [showSafariGapCover, setShowSafariGapCover] = useState(true);
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

    const updateFooterScale = () => scaleY.set(getScrollFooterScale());

    updateFooterScale();
    const unsubscribe = scrollYProgress.on("change", updateFooterScale);
    window.addEventListener("resize", updateFooterScale);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", updateFooterScale);
    };
  }, [canScroll, isTransitioning, scaleY, scrollYProgress]);

  useEffect(() => {
    if (!canScroll && !isTransitioning) {
      scaleY.set(0);
    }
  }, [canScroll, isTransitioning, scaleY]);

  useEffect(() => {
    setShowCopyright(false);
    setIsTransitioning(true);
    setShowSafariGapCover(true);
    scaleY.set(2);

    const gapCoverExitTimer = window.setTimeout(
      () => setShowSafariGapCover(false),
      (TRANSITION_DELAY_SECONDS +
        TRANSITION_DURATION_SECONDS -
        SAFARI_GAP_COVER_EXIT_LEAD_SECONDS) *
        1000,
    );

    const controls = animate(scaleY, 0, {
      duration: TRANSITION_DURATION_SECONDS,
      delay: TRANSITION_DELAY_SECONDS,
      ease: "easeInOut",
      onComplete: () => {
        setIsTransitioning(false);
        if (canScroll) {
          scaleY.set(getScrollFooterScale());
        } else {
          scaleY.set(0);
        }
      },
    });

    return () => {
      window.clearTimeout(gapCoverExitTimer);
      controls.stop();
    };
  }, [canScroll, scaleY]);

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
    <motion.footer
      className={`${Z_INDEX_CLASS.pageChrome} pointer-events-none fixed inset-0 bottom-0 overflow-hidden`}
    >
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 bottom-0 h-[max(4rem,env(safe-area-inset-bottom))] bg-black will-change-transform [transform:translate3d(0,0,0)]"
        initial={false}
        animate={{ y: showSafariGapCover ? 0 : "100%" }}
        transition={{ duration: SAFARI_GAP_COVER_EXIT_LEAD_SECONDS, ease: "easeIn" }}
      />
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
        className="absolute inset-x-0 bottom-0 h-full w-[200%]"
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
          styleType="body-md"
          className="absolute right-8 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] text-white/70"
        >
          {copyrightText}
        </Text>
      </motion.div>
    </motion.footer>
  );
};
