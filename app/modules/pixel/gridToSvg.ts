import type { Grid } from "./parseGrid";

export const gridToSvg = (grid: Grid, cellSize = 10) => {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const rects: string[] = [];
  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (!cell) return;
      rects.push(
        `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="${cell}"/>`,
      );
    });
  });
  const width = cols * cellSize;
  const height = rows * cellSize;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${rects.join("")}</svg>`;
};
