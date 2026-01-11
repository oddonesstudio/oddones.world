"use client";

import { useEffect } from "react";

import { getThemeVars, setThemeVars, type HSL } from "./themeUtils";

const parseStoredTheme = (): HSL | null => {
  const saved = localStorage.getItem("themeColor");
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed.h === "number") {
      return parsed as HSL;
    }
  } catch (e) {
    // ignore
  }
  return null;
};

export default function ThemeStorage({ enabled = true }: { enabled?: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    const saved = parseStoredTheme();
    if (!saved) return;
    setThemeVars(getThemeVars(saved));
  }, [enabled]);

  return null;
}
