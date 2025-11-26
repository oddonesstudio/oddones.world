/** biome-ignore-all lint/suspicious/noArrayIndexKey: <TODO> */
"use client";

import { Dialog } from "radix-ui";
import { useState } from "react";

import { getGridClues } from "@/app/modules/pixel";
import { normaliseGrid } from "@/app/modules/pixel/normaliseGrid";
import type { Grid } from "@/app/modules/pixel/parseGrid";

import { Container } from "./Container/Container";
import { Icon } from "./Icon/Icon";
import { PixelReveal } from "./PixelReveal/PixelReveal";

type CellState = "empty" | "filled" | "cross";

// Build a simple SVG from a grid for the trigger thumbnail.
const gridToSvg = (grid: Grid, cellSize = 10) => {
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

export const PuzzleDialog = ({
  title,
  svg,
  size,
  solution,
  closeIcon,
  onSolved,
}: {
  title?: string;
  svg?: string;
  size?: number;
  solution?: string | Grid;
  closeIcon?: {
    title?: string;
    svg?: string;
  };
  onSolved?: () => void;
}) => {
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

  function handleCellClick(r: number, c: number) {
    setGridState((prev) => {
      const newGrid = prev.map((row) => [...row]);
      newGrid[r][c] =
        prev[r][c] === "empty" ? "filled" : prev[r][c] === "filled" ? "cross" : "empty";
      return newGrid;
    });
  }

  function checkComplete() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const target = solutionGrid[r][c] !== 0;
        const filled = gridState[r][c] === "filled";
        if (target !== filled) return false;
      }
    }
    return true;
  }

  function handleCheck() {
    if (checkComplete()) {
      setComplete(true);
      setOpen(false);
      setTimeout(() => onSolved?.(), 400);
    } else {
      setError("OOps");
    }
  }

  // Prefer provided solution, otherwise fall back to SVG. If neither, skip render.
  const source = solution ?? svg;
  if (!source) return null;

  // Accept JSON strings or arrays; if single quotes slipped through, normalise them.
  const sanitisedSolution = typeof source === "string" ? source.replace(/'/g, '"') : source;
  const solutionGrid = normaliseGrid(sanitisedSolution);

  const { rowClues, colClues } = getGridClues(solutionGrid);

  const rows = solutionGrid.length;
  const cols = solutionGrid[0]?.length || 0;

  const [gridState, setGridState] = useState<CellState[][]>(
    Array.from({ length: rows }, () => Array(cols).fill("empty")),
  );

  if (!rows || !cols) return null;

  const triggerGrid = solutionGrid.map((row) => row.map((cell) => (cell === 0 ? "#000000" : cell)));
  const triggerSvg = svg || gridToSvg(triggerGrid);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="cursor-pointer">
          <PixelReveal svg={triggerSvg} size={size} />
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 data-[state=open]:animate-overlayShow z-40" />
        <Dialog.Content className="fixed left-1/2 overflow-clip top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-lg z-40">
          <Dialog.Title className="sticky top-0 bg-white p-6 shadow-xs flex items-center justify-between text-xl font-semibold">
            {title ?? "Mystery Puzzle"}
            <Dialog.Close className="focus-visible:outline-none">
              <Icon title={closeIcon?.title} svg={closeIcon?.svg} size={16} color="#444" />
            </Dialog.Close>
          </Dialog.Title>

          <Container className="overflow-y-scroll aspect-square py-10 px-20!">
            <div className="grid gap-2">
              <div
                className="grid items-end col-start-2"
                style={{
                  gridTemplateColumns: `repeat(${colClues.length}, 20px)`,
                }}
              >
                {colClues.map((clue, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {clue.map((c, j) => (
                      <span key={j} className="size-5 flex justify-center text-xs">
                        {c}
                      </span>
                    ))}
                  </div>
                ))}
              </div>

              <div
                className="grid justify-items-end"
                style={{
                  gridTemplateRows: `repeat(${rowClues.length}, 20px)`,
                }}
              >
                {rowClues.map((clue, i) => (
                  <div key={i} className="flex">
                    {clue.map((n, j) => (
                      <span key={j} className="size-5 flex justify-center text-xs">
                        {n}
                      </span>
                    ))}
                  </div>
                ))}
              </div>

              <div
                className="grid"
                style={{
                  gridTemplateRows: `repeat(${rows}, 20px)`,
                  gridTemplateColumns: `repeat(${cols}, 20px)`,
                }}
              >
                {solutionGrid.map((row: any[], r: number) =>
                  row.map((_: any, c: number) => {
                    const state = gridState[r][c];
                    const target: string = solutionGrid[r][c] as string;
                    const bg =
                      state === "filled"
                        ? target || "#000"
                        : state === "cross"
                          ? "#ddd"
                          : "#f9f9f9";
                    return (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        onClick={() => handleCellClick(r, c)}
                        className="border border-gray-300 text-center text-[10px] cursor-pointer select-none"
                        style={{
                          backgroundColor: bg,
                          color: state === "cross" ? "#555" : "transparent",
                        }}
                      >
                        {state === "cross" ? "✕" : ""}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>
          </Container>

          {/* <Button label="Check" onClick={handleCheck}></Button> */}

          {complete && <p className="mt-4 text-green-600">Yay! You solved it!</p>}
          {error && !complete && <p className="mt-4 text-red-400">{error}</p>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
