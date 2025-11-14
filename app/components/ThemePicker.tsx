"use client";

import { useEffect, useState } from "react";
import { HslColorPicker } from "react-colorful";

export default function ThemePicker() {
  const [mounted, setMounted] = useState(false);
  const [color, setColor] = useState({ h: 200, s: 100, l: 50 });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("themeColor");
    if (saved) setColor(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const bg = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    const contrastHue = (color.h + 180) % 360;
    const contrastLight = color.l > 60 ? 25 : 85;
    const text = `hsl(${contrastHue}, ${color.s}%, ${contrastLight}%)`;

    document.documentElement.style.setProperty("--background", bg);
    document.documentElement.style.setProperty("--foreground", text);

    localStorage.setItem("themeColor", JSON.stringify(color));
  }, [color, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-lg">
      <HslColorPicker color={color} onChange={setColor} />
    </div>
  );
}
