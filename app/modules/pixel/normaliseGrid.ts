import { type Grid, parseGrid } from "./parseGrid";
import { svgToGrid } from "./svgToGrid";

export function normaliseGrid(input: string | Grid | null): Grid {
  if (!input) return [];

  if (Array.isArray(input)) return input as Grid;

  if (typeof input === "string" && input.trim().startsWith("<svg")) {
    return svgToGrid(input);
  }

  return parseGrid(input);
}
