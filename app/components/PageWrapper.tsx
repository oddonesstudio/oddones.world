"use client";

import type { PropsWithChildren } from "react";

export const PageWrapper = ({ children, bgColor }: PropsWithChildren & { bgColor?: string }) => (
  <div
    className="absolute inset-0 flex items-center justify-center m-6 rounded-3xl"
    style={{ backgroundColor: bgColor ?? "var(--page-background)" }}
  >
    {children}
  </div>
);
