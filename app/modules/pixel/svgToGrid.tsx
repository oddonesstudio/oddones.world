import type { Grid } from "./parseGrid";

export function svgToGrid(svg: string): Grid {
  if (typeof window === "undefined") return [];

  const div = document.createElement("div");
  div.innerHTML = svg.trim();

  const rects = Array.from(div.querySelectorAll("rect"));
  if (!rects.length) return [];

  const coords = rects.map((r) => ({
    x: parseFloat(r.getAttribute("x") || "0"),
    y: parseFloat(r.getAttribute("y") || "0"),
    fill: r.getAttribute("fill") || "#000",
  }));

  const xs = [...new Set(coords.map((c) => c.x))].sort((a, b) => a - b);
  const ys = [...new Set(coords.map((c) => c.y))].sort((a, b) => a - b);

  const grid: Grid = ys.map(() => Array(xs.length).fill(0));

  coords.forEach(({ x, y, fill }) => {
    const row = ys.indexOf(y);
    const col = xs.indexOf(x);
    grid[row][col] = fill;
  });

  return grid;
}
