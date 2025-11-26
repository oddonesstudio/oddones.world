"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export interface PixelProps {
  title?: string;
  svg?: string;
  size?: number;
  color?: string;
  className?: string;
}

export const PixelReveal = ({
  title,
  svg,
  size,
  color = "currentColor",
  className,
}: PixelProps) => {
  const [parsed, setParsed] = useState<{
    rects: Array<any>;
    width: string | null;
    height: string | null;
    viewBox?: string;
  } | null>(null);

  useEffect(() => {
    if (!svg) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");
    const svgNode = doc.querySelector("svg");
    if (!svgNode) return;

    const width = svgNode.getAttribute("width");
    const height = svgNode.getAttribute("height");
    const viewBox = svgNode.getAttribute("viewBox") ?? undefined;

    const rects = Array.from(svgNode.querySelectorAll("rect")).map((r, i) => ({
      x: Number(r.getAttribute("x")),
      y: Number(r.getAttribute("y")),
      w: Number(r.getAttribute("width")),
      h: Number(r.getAttribute("height")),
      fill: r.getAttribute("fill") ?? color,
      index: i,
    }));

    setParsed({ rects, width, height, viewBox });
  }, [svg, color]);

  if (!parsed) return null;

  const { rects, width, height, viewBox } = parsed;
  const hasExplicitSize = typeof size === "number";

  return (
    <motion.svg
      className={className}
      width={hasExplicitSize ? size : (width ?? "auto")}
      height={hasExplicitSize ? size : (height ?? "auto")}
      viewBox={viewBox}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // ← built-in scroll trigger
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.01 } },
      }}
    >
      <title>{title}</title>

      {rects.map((r) => (
        <motion.rect
          key={r.index}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          fill={r.fill}
          custom={r.index}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delay: 1 + Math.random() * 0.4,
                duration: 0.25,
                ease: "easeOut",
              },
            },
          }}
        />
      ))}
    </motion.svg>
  );
};
