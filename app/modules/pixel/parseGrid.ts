export type GridCell = 0 | string;
export type Grid = GridCell[][];

export function parseGrid(input: string | Grid | null | undefined): Grid {
  if (!input) return [];

  if (Array.isArray(input)) return input as Grid;

  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed as Grid;
    return [];
  } catch {
    return [];
  }
}
