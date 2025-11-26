import type { Grid } from "./parseGrid";

export function getClueLine(line: (string | number)[]) {
  const clues: number[] = [];
  let count = 0;

  for (const cell of line) {
    if (cell !== 0) count++;
    else if (count > 0) {
      clues.push(count);
      count = 0;
    }
  }

  if (count > 0) clues.push(count);

  return clues.length > 0 ? clues : [0];
}

export function getGridClues(grid: Grid) {
  const rowClues = grid.map((row) => getClueLine(row));
  const colClues: number[][] = [];

  const cols = grid[0]?.length ?? 0;
  for (let x = 0; x < cols; x++) {
    const column = grid.map((row) => row[x]);
    colClues.push(getClueLine(column));
  }

  return { rowClues, colClues };
}
