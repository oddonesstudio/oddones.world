"use client";

import type { PropsWithChildren } from "react";

export const PageWrapper = ({ children }: PropsWithChildren & { invert?: boolean }) => (
  <div className={`min-h-screen transition-colors`}>
    <div style={{ marginTop: "calc(var(--header-height) * -1)" }}>{children}</div>
  </div>
);
