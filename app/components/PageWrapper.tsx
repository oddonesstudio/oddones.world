"use client";

import type { PropsWithChildren } from "react";

import ThemeScope from "./ThemeScope";
import ThemeStorage from "./ThemeStorage";
import type { HSL } from "./themeUtils";

interface PageWrapperProps extends PropsWithChildren {
  scopedTheme?: HSL | null;
  useStoredTheme?: boolean;
}

export const PageWrapper = ({ children, scopedTheme, useStoredTheme = true }: PageWrapperProps) => {
  return (
    <section className="flex flex-col gap-10 pb-(--footer-height) min-h-screen bg-background p-4">
      {children}
      {scopedTheme ? <ThemeScope theme={scopedTheme} /> : null}
      <ThemeStorage enabled={useStoredTheme && !scopedTheme} />
    </section>
  );
};
