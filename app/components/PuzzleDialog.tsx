/** biome-ignore-all lint/suspicious/noArrayIndexKey: <TODO> */
"use client";

import { Dialog } from "radix-ui";
import { useState } from "react";
import { Button } from "./Button/Button";

type CellState = "empty" | "filled" | "cross";

const getClues = (line: (string | number)[]) => {
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
};

const calculateClues = (grid: (string | number)[][]) => {
  const rowClues = grid.map((r) => getClues(r));
  const colClues: number[][] = [];
  for (let x = 0; x < grid[0]?.length; x++) {
    const col = grid.map((r) => r[x]);
    colClues.push(getClues(col));
  }
  return { rowClues, colClues };
};

export const PuzzleDialog = ({
  solution,
  onSolved,
}: {
  solution: (string | number)[][];
  onSolved?: () => void;
}) => {
  const rows = solution.length;
  const cols = solution[0]?.length || 0;
  const [gridState, setGridState] = useState<CellState[][]>(
    Array.from({ length: rows }, () => Array(cols).fill("empty")),
  );
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

  const { rowClues, colClues } = calculateClues(solution);

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
        const target = solution[r][c] !== 0;
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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="absolute inset-0 cursor-pointer" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 data-[state=open]:animate-overlayShow z-30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-3xl shadow-lg z-40">
          <Dialog.Title className="text-xl font-semibold mb-4">Puzzle</Dialog.Title>

          <div className="grid gap-2 mx-auto my-10">
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
              {solution.map((row, r) =>
                row.map((_, c) => {
                  const state = gridState[r][c];
                  const target: string = solution[r][c] as string;
                  const bg =
                    state === "filled" ? target || "#000" : state === "cross" ? "#ddd" : "#f9f9f9";
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

          <div className="mt-4 flex justify-between">
            <Button label="Check" onClick={handleCheck}></Button>
            <Dialog.Close asChild>
              <Button label="Close" variant="secondary" />
            </Dialog.Close>
          </div>

          {complete && <p className="mt-4 text-green-600">Yay! You solved it!</p>}
          {error && !complete && <p className="mt-4 text-red-400">{error}</p>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
