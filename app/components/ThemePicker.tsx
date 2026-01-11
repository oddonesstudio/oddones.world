"use client";

import { useEffect, useState } from "react";
import { HslColorPicker } from "react-colorful";

import { getThemeVars, setThemeVars, type HSL } from "./themeUtils";

export default function ThemePicker({ defaultTheme }: { defaultTheme?: HSL | null }) {
  const [mounted, setMounted] = useState(false);
  const [color, setColor] = useState<HSL>({ h: 200, s: 100, l: 50 });
  const [hasUserPicked, setHasUserPicked] = useState(false);
  const [hasStoredTheme, setHasStoredTheme] = useState(false);

  // Initialize on mount only
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("themeColor");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.h === "number") {
          setHasStoredTheme(true);
          setColor(parsed);
          return;
        }
      } catch (e) {
        // ignore
      }
    }
    if (defaultTheme && typeof defaultTheme.h === "number") {
      setColor(defaultTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted || hasUserPicked || hasStoredTheme) return;
    if (defaultTheme && typeof defaultTheme.h === "number") {
      setColor(defaultTheme);
    }
  }, [defaultTheme, hasStoredTheme, hasUserPicked, mounted]);

  useEffect(() => {
    if (!mounted) return;
    setThemeVars(getThemeVars(color));

    localStorage.setItem("themeColor", JSON.stringify(color));
  }, [color, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-lg z-50">
      <HslColorPicker
        color={color}
        onChange={(nextColor) => {
          setHasUserPicked(true);
          setColor(nextColor);
        }}
      />
    </div>
  );
}
