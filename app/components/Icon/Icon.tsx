"use client";

import { useMemo } from "react";

import type { PixelProps } from "../PixelReveal/PixelReveal";

export const Icon = ({ title, svg, size, color = "currentColor", className }: PixelProps) => {
  const parsed = useMemo(() => {
    if (!svg) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");
    const svgNode = doc.querySelector("svg");
    if (!svgNode) return null;

    const width = svgNode.getAttribute("width");
    const height = svgNode.getAttribute("height");

    const rects = Array.from(svgNode.querySelectorAll("rect")).map((r, i) => ({
      x: Number(r.getAttribute("x")),
      y: Number(r.getAttribute("y")),
      w: Number(r.getAttribute("width")),
      h: Number(r.getAttribute("height")),
      fill: r.getAttribute("fill") ?? color,
      index: i,
    }));

    const xs = rects.map((r) => r.x);
    const ys = rects.map((r) => r.y);
    const ws = rects.map((r) => r.x + r.w);
    const hs = rects.map((r) => r.y + r.h);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...ws);
    const maxY = Math.max(...hs);

    const tightViewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

    return { rects, width, height, tightViewBox };
  }, [svg, color]);

  if (!parsed) return null;

  const { rects, width, height, tightViewBox } = parsed;
  const hasExplicitSize = typeof size === "number";

  return (
    <svg
      className={`cursor-pointer transition-transform duration-200 ease-out hover:rotate-6 ${className ?? ""}`}
      width={hasExplicitSize ? size : (width ?? "auto")}
      height={hasExplicitSize ? size : (height ?? "auto")}
      viewBox={tightViewBox}
    >
      <title>{title}</title>
      {rects.map((r) => (
        <rect key={r.index} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
      ))}
    </svg>
  );
};
