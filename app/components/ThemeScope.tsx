"use client";

import { useEffect, useRef } from "react";

import { getThemeVars, readThemeVars, restoreThemeVars, setThemeVars, type HSL } from "./themeUtils";

export default function ThemeScope({ theme }: { theme?: HSL | null }) {
  const previousTheme = useRef<ReturnType<typeof readThemeVars> | null>(null);

  useEffect(() => {
    if (!theme) return;
    if (!previousTheme.current) {
      previousTheme.current = readThemeVars();
    }

    setThemeVars(getThemeVars(theme));

    return () => {
      if (previousTheme.current) {
        restoreThemeVars(previousTheme.current);
      }
    };
  }, [theme]);

  return null;
}
