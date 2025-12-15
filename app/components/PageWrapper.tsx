"use client";

import type { PropsWithChildren } from "react";

export const PageWrapper = ({ children, bgColor }: PropsWithChildren & { bgColor?: string }) => (
  <section
    className="relative flex w-full min-h-[calc(100vh-48px)] items-center justify-center rounded-3xl"
    style={{ backgroundColor: bgColor ?? "var(--page-background)" }}
  >
    {children}
  </section>
);
