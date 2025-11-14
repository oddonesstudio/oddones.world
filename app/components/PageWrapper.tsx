"use client";

import type { PropsWithChildren } from "react";

export const PageWrapper = ({ children }: PropsWithChildren & { invert?: boolean }) => (
  <div className={`min-h-screen transition-colors`}>
    <div className="-mt-[148px]">{children}</div>
  </div>
);
