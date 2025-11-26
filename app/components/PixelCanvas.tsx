/** biome-ignore-all lint/suspicious/noArrayIndexKey: <TODO> */

import { useCallback, useEffect, useState } from "react";

import { set, unset } from "sanity";

type PixelCanvasProps = {
  value?: string;
  onChange: (patch: ReturnType<typeof set> | ReturnType<typeof unset>) => void;
};

export const PixelCanvas: React.FC<PixelCanvasProps> = ({ value, onChange }) => {
  const size = 16; // TODO: allow custom size
  const [pixels, setPixels] = useState<boolean[]>(Array(size * size).fill(false));

  useEffect(() => {
    if (value?.includes("<rect")) {
      const activePixels: boolean[] = Array(size * size).fill(false);
      const rectMatches = value.matchAll(/x="(\d+)" y="(\d+)"/g);
      for (const match of rectMatches) {
        const x = Number(match[1]);
        const y = Number(match[2]);
        const index = y * size + x;
        activePixels[index] = true;
      }
      setPixels(activePixels);
    }
  }, [value]);

  const togglePixel = useCallback((index: number) => {
    setPixels((prev) => {
      const newPixels = [...prev];
      newPixels[index] = !newPixels[index];
      return newPixels;
    });
  }, []);

  useEffect(() => {
    const rects = pixels
      .map((filled, i) =>
        filled ? `<rect x="${i % size}" y="${Math.floor(i / size)}" width="1" height="1" />` : "",
      )
      .join("");

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="currentColor">${rects}</svg>`;

    if (typeof onChange === "function") {
      try {
        const patch = svg.includes("<rect") ? set(svg) : unset();
        onChange(patch);
      } catch (err) {
        console.warn("Skipping patch (read-only mode):", err);
      }
    }
  }, [pixels, onChange]);

  const handleClear = () => setPixels(Array(size * size).fill(false));

  return (
    <div style={{ userSelect: "none" }}>
      <div style={{ marginBottom: "0.5rem" }}>
        <button
          type="button"
          onClick={handleClear}
          style={{
            background: "#f5f5f5",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Clear
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 20px)`,
        }}
      >
        {pixels.map((filled, i) => (
          <button
            key={i}
            type="button"
            onClick={() => togglePixel(i)}
            aria-pressed={filled}
            style={{
              width: 20,
              height: 20,
              background: filled ? "black" : "white",
              border: "1px solid #ccc",
              padding: 0,
              cursor: "pointer",
              outline: "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};
