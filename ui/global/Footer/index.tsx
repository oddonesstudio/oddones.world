"use client";

import { WavyFooter } from "../WavyFooter";

export const PageTransitionFooter = ({
  suppressInitialAnimation = false,
}: {
  suppressInitialAnimation?: boolean;
}) => {
  if (suppressInitialAnimation) return null;

  return <WavyFooter />;
};
