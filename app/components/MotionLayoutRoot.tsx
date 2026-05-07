"use client";

import { LayoutGroup } from "motion/react";
import type { ReactNode } from "react";

import { LAYOUT_IDS } from "@/app/constants/ui";

export function MotionLayoutRoot({ children }: { children: ReactNode }) {
  return <LayoutGroup id={LAYOUT_IDS.articleRouteTransition}>{children}</LayoutGroup>;
}
