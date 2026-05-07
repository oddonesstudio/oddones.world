/** biome-ignore-all lint/suspicious/noArrayIndexKey: <idk> */
"use client";

import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useEffect, useRef, useState } from "react";
import { useAppUi } from "@/app/components/AppUiContext";
import { STORAGE_KEYS } from "@/app/constants/ui";
import {
  type Grid,
  type GridCell,
  getGridClues,
  gridToSvg,
  normaliseGrid,
} from "@/app/modules/pixel";
import { cn } from "@/ui/_lib/utils";
import { Button } from "@/ui/atoms/Button";
import { Pixel } from "@/ui/atoms/Pixel";
import { Text } from "@/ui/atoms/Text";
import { Container } from "@/ui/global/Container";
import { useMediaQuery } from "@/ui/hooks/useMediaQuery";

type CellState = "empty" | "filled" | "cross";
type PaintMode = "fill" | "cross";

interface PuzzleDialogProps {
  className?: string;
  title?: string | null;
  svg?: string | null;
  size?: number;
  solution?: string | Grid | null;
  onSolved?: (title?: string | null) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getCellFromElement(element: Element | null) {
  if (!element) return null;
  const button = element.closest("button[data-row][data-col]");
  if (!button) return null;
  const row = Number(button.getAttribute("data-row"));
  const col = Number(button.getAttribute("data-col"));
  if (Number.isNaN(row) || Number.isNaN(col)) return null;
  return { r: row, c: col };
}

function getGroupSize(gridSize: number) {
  if (gridSize <= 16) return 4;
  if (gridSize <= 24) return 4;
  if (gridSize <= 32) return 4;
  if (gridSize <= 40) return 5;
  return Math.floor(gridSize / 6);
}

function createEmptyGrid(rows: number, cols: number) {
  return Array.from({ length: rows }, () => Array(cols).fill("empty"));
}

// ============================================================================
// Sub-components
// ============================================================================

interface GridCellProps {
  row: number;
  col: number;
  state: CellState;
  target: string;
  solutionGrid: (string | number)[][];
  showGuides: boolean;
  hoverCell: { r: number; c: number } | null;
  onCellClick: (r: number, c: number) => void;
  onCellRightClick: (r: number, c: number) => void;
  onPointerEnter: (r: number, c: number) => void;
  onDoubleClick: () => void;
}

function PuzzleGridCell({
  row,
  col,
  state,
  target,
  solutionGrid,
  showGuides,
  hoverCell,
  onCellClick,
  onCellRightClick,
  onPointerEnter,
  onDoubleClick,
}: GridCellProps) {
  const gridSize = solutionGrid.length;
  const GROUP_SIZE = getGroupSize(gridSize);

  const bg = state === "filled" ? target : state === "cross" ? "#ddd" : "#f9f9f9";
  const isGuideRow = showGuides && row % GROUP_SIZE === 0;
  const isGuideCol = showGuides && col % GROUP_SIZE === 0;
  const isHoverBand = hoverCell ? hoverCell.r === row || hoverCell.c === col : false;
  const hoverBg = state === "cross" ? "#dbe2f5" : state === "filled" ? bg : "#eef3ff";
  const finalBg = isHoverBand ? hoverBg : bg;

  const shouldBeFilled = solutionGrid[row][col] !== 0;
  const isMistake =
    (state === "filled" && !shouldBeFilled) || (state === "cross" && shouldBeFilled);

  const baseBorder = "#e5e7eb";
  const guideBorder = "#9ca3af";
  const filledBorder = bg;
  const topBorderColor = state === "filled" ? filledBorder : isGuideRow ? guideBorder : baseBorder;
  const leftBorderColor = state === "filled" ? filledBorder : isGuideCol ? guideBorder : baseBorder;
  const rightBorderColor = state === "filled" ? filledBorder : baseBorder;
  const bottomBorderColor = state === "filled" ? filledBorder : baseBorder;

  return (
    <button
      key={`${row}-${col}`}
      type="button"
      data-row={row}
      data-col={col}
      onDoubleClick={onDoubleClick}
      onContextMenu={(event) => {
        event.preventDefault();
        onCellRightClick(row, col);
      }}
      onClick={(event) => {
        if (event.detail !== 0) return;
        onCellClick(row, col);
      }}
      className={cn("text-center text-[10px] select-none")}
      onPointerEnter={() => onPointerEnter(row, col)}
      style={{
        backgroundColor: finalBg,
        color: state === "cross" ? "#555" : "transparent",
        outline: isMistake ? "2px solid #ef4444" : "none",
        outlineOffset: isMistake ? "-2px" : "0px",
        borderTopWidth: isGuideRow ? "2px" : "1px",
        borderLeftWidth: isGuideCol ? "2px" : "1px",
        borderTopColor: topBorderColor,
        borderLeftColor: leftBorderColor,
        borderRightColor: rightBorderColor,
        borderBottomColor: bottomBorderColor,
      }}
    >
      {state === "cross" ? "✕" : ""}
    </button>
  );
}

interface ColumnCluesProps {
  colClues: number[][];
  checkedCompletedCols: Set<number>;
}

function ColumnClues({ colClues, checkedCompletedCols }: ColumnCluesProps) {
  return (
    <div
      className="grid items-end col-start-2"
      style={{
        gridTemplateColumns: `repeat(${colClues.length}, 20px)`,
      }}
    >
      {colClues.map((clue, i) => (
        <div
          key={i}
          className={cn(
            "flex flex-col items-center transition-opacity",
            checkedCompletedCols.has(i) && "opacity-40",
          )}
        >
          {clue.map((c, j) => (
            <span key={j} className="size-5 flex justify-center text-xs">
              {c}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

interface RowCluesProps {
  rowClues: number[][];
  checkedCompletedRows: Set<number>;
}

function RowClues({ rowClues, checkedCompletedRows }: RowCluesProps) {
  return (
    <div
      className="grid justify-items-end"
      style={{
        gridTemplateRows: `repeat(${rowClues.length}, 20px)`,
      }}
    >
      {rowClues.map((clue, i) => (
        <div
          key={i}
          className={cn("flex transition-opacity", checkedCompletedRows.has(i) && "opacity-40")}
        >
          {clue.map((n, j) => (
            <span key={j} className="size-5 flex justify-center text-xs">
              {n}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

interface DialogHeaderProps {
  complete: boolean;
  title?: string | null;
}

function PuzzleDialogHeader({ complete, title }: DialogHeaderProps) {
  return (
    <div className="sticky top-0 bg-page-background py-6 px-10 shadow-xs flex items-center justify-between text-xl font-semibold">
      <Dialog.Title className="relative inline-flex">
        <span
          className={cn(
            "transition-all duration-300 ease-out",
            complete ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0",
          )}
        >
          ?
        </span>
        <span
          className={cn(
            "absolute left-0 top-0 transition-all duration-300 ease-out",
            complete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
          )}
        >
          {title ?? ""}
        </span>
      </Dialog.Title>
      <Dialog.Close className="focus-visible:outline-none cursor-pointer">
        <X />
      </Dialog.Close>
    </div>
  );
}

interface DialogFooterProps {
  showGuides: boolean;
  onToggleGuides: () => void;
  onCheckHints: () => void;
}

function PuzzleDialogFooter({ showGuides, onToggleGuides, onCheckHints }: DialogFooterProps) {
  return (
    <div className="flex justify-between gap-12 px-10 py-10">
      <Button
        variant="ghost"
        className=" gap-3"
        label="Show Guides"
        aria-pressed={showGuides}
        onClick={onToggleGuides}
        iconLeft={
          <span
            aria-hidden="true"
            className={cn(
              "relative h-5 w-9 rounded-full border transition-colors duration-200",
              showGuides ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-200",
            )}
          >
            <span
              className={cn(
                "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-200",
                showGuides ? "right-0" : "left-0",
              )}
            />
          </span>
        }
      />
      <Button variant="ghost" label="Auto Complete" onClick={onCheckHints} />
      {/* <Button label="Unlock Article" disabled={!isComplete} /> */}
    </div>
  );
}

export const PuzzleDialog = ({
  className,
  title,
  svg,
  size,
  solution,
  onSolved,
}: PuzzleDialogProps) => {
  const { notifyPuzzleDialogOpen, notifyPuzzleSolved } = useAppUi();
  const [complete, setComplete] = useState(false);
  const [open, setOpen] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const [hoverCell, setHoverCell] = useState<{ r: number; c: number } | null>(null);
  const [paintMode, setPaintMode] = useState<PaintMode>("fill");
  const [checkedCompletedRows, setCheckedCompletedRows] = useState<Set<number>>(new Set());
  const [checkedCompletedCols, setCheckedCompletedCols] = useState<Set<number>>(new Set());
  const isMobile = useMediaQuery("(max-width: 767px)");

  // =========================================================================
  // Refs for drag handling
  // =========================================================================
  const dragActiveRef = useRef(false);
  const dragMovedRef = useRef(false);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragStartCellRef = useRef<{ r: number; c: number } | null>(null);
  const dragPaintedStartRef = useRef(false);
  const hintTimeoutRef = useRef<number | null>(null);

  // =========================================================================
  // Solution setup
  // =========================================================================
  const source = solution ?? svg;
  const sanitisedSolution =
    source && typeof source === "string" ? source.replace(/'/g, '"') : source;
  const solutionGrid = sanitisedSolution ? normaliseGrid(sanitisedSolution) : [];
  const { rowClues, colClues } = getGridClues(solutionGrid);
  const rows = solutionGrid.length;
  const cols = solutionGrid[0]?.length || 0;
  const storageKey = STORAGE_KEYS.puzzleState(title);

  // Initialize grid
  const [gridState, setGridState] = useState<CellState[][]>(() => createEmptyGrid(rows, cols));

  useEffect(() => {
    if (!isMobile || !open) return;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          gridState,
          showGuides,
          complete,
        }),
      );
    } catch {
      // Ignore storage failures (private mode, quota, etc.).
    }
    setOpen(false);
    notifyPuzzleDialogOpen(false);
  }, [complete, gridState, isMobile, notifyPuzzleDialogOpen, open, showGuides, storageKey]);

  if (isMobile) return null;
  if (!source || !rows || !cols) return null;
  const triggerSvg = svg || gridToSvg(solutionGrid);

  // =========================================================================
  // Cell interaction handlers
  // =========================================================================

  function handleCellClick(r: number, c: number) {
    setGridState((prev) => {
      const newGrid = prev.map((row) => [...row]);
      const intendedState = paintMode === "fill" ? "filled" : "cross";
      const nextState = prev[r][c] === intendedState ? "empty" : intendedState;
      newGrid[r][c] = nextState;
      return newGrid;
    });
  }

  function handleCellRightClick(r: number, c: number) {
    setGridState((prev) => {
      const newGrid = prev.map((row) => [...row]);
      const nextState = prev[r][c] === "cross" ? "empty" : "cross";
      newGrid[r][c] = nextState;
      return newGrid;
    });
  }

  function paintCell(r: number, c: number) {
    setGridState((prev) => {
      const newGrid = prev.map((row) => [...row]);
      const nextState = paintMode === "fill" ? "filled" : "cross";
      if (newGrid[r][c] === nextState) return prev;
      newGrid[r][c] = nextState;
      return newGrid;
    });
  }

  // =========================================================================
  // Grid validation and completion checking
  // =========================================================================

  function getCompletedLines(grid: CellState[][]) {
    const completedRows = new Set<number>();
    const completedCols = new Set<number>();

    for (let r = 0; r < rows; r++) {
      let rowComplete = true;
      for (let c = 0; c < cols; c++) {
        const target = solutionGrid[r][c] !== 0;
        const state = grid[r][c];
        if ((target && state !== "filled") || (!target && state === "filled")) {
          rowComplete = false;
          break;
        }
      }
      if (rowComplete) completedRows.add(r);
    }

    for (let c = 0; c < cols; c++) {
      let colComplete = true;
      for (let r = 0; r < rows; r++) {
        const target = solutionGrid[r][c] !== 0;
        const state = grid[r][c];
        if ((target && state !== "filled") || (!target && state === "filled")) {
          colComplete = false;
          break;
        }
      }
      if (colComplete) completedCols.add(c);
    }

    return { completedRows, completedCols };
  }

  function applyHints(grid: CellState[][], rowsToCheck: Set<number>, colsToCheck: Set<number>) {
    const next = grid.map((row) => [...row]);

    const isRowComplete = (rowIndex: number) => {
      for (let col = 0; col < cols; col++) {
        const target = solutionGrid[rowIndex][col] !== 0;
        const state = next[rowIndex][col];
        if ((target && state !== "filled") || (!target && state === "filled")) return false;
      }
      return true;
    };

    const isColComplete = (colIndex: number) => {
      for (let row = 0; row < rows; row++) {
        const target = solutionGrid[row][colIndex] !== 0;
        const state = next[row][colIndex];
        if ((target && state !== "filled") || (!target && state === "filled")) return false;
      }
      return true;
    };

    rowsToCheck.forEach((rowIndex) => {
      if (!isRowComplete(rowIndex)) return;
      for (let col = 0; col < cols; col++) {
        if (next[rowIndex][col] === "empty") next[rowIndex][col] = "cross";
      }
    });

    colsToCheck.forEach((colIndex) => {
      if (!isColComplete(colIndex)) return;
      for (let row = 0; row < rows; row++) {
        if (next[row][colIndex] === "empty") next[row][colIndex] = "cross";
      }
    });

    return next;
  }

  function showHintMessage(message: string) {
    setHintMessage(message);
    setHintVisible(true);
    if (hintTimeoutRef.current) window.clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = window.setTimeout(() => {
      setHintVisible(false);
      hintTimeoutRef.current = window.setTimeout(() => setHintMessage(null), 200);
    }, 1800);
  }

  function checkForHints() {
    const { completedRows: prevRows, completedCols: prevCols } = getCompletedLines(gridState);
    const corrected = gridState.map((row, r) =>
      row.map((cell, c) => {
        const shouldBeFilled = solutionGrid[r][c] !== 0;
        if (cell === "filled" && !shouldBeFilled) return "cross";
        if (cell === "cross" && shouldBeFilled) return "filled";
        return cell;
      }),
    );
    const { completedRows, completedCols } = getCompletedLines(corrected);
    const next = applyHints(corrected, completedRows, completedCols);

    let correctedCount = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const shouldBeFilled = solutionGrid[r][c] !== 0;
        const state = gridState[r][c];
        if ((state === "filled" && !shouldBeFilled) || (state === "cross" && shouldBeFilled)) {
          correctedCount += 1;
        }
      }
    }

    const newlyCompletedRows = [...completedRows].filter((row) => !prevRows.has(row)).length;
    const newlyCompletedCols = [...completedCols].filter((col) => !prevCols.has(col)).length;

    setGridState(next);
    setCheckedCompletedRows(completedRows);
    setCheckedCompletedCols(completedCols);

    return { correctedCount, newlyCompletedRows, newlyCompletedCols };
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

  // =========================================================================
  // Puzzle actions
  // =========================================================================

  function persistState() {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          gridState,
          showGuides,
          complete,
        }),
      );
    } catch {
      // Ignore storage failures (private mode, quota, etc.).
    }
  }

  function handleCheckHints() {
    const wasComplete = checkComplete();
    if (wasComplete) {
      setComplete(true);
      persistState();
      setTimeout(() => {
        setOpen(false);
        notifyPuzzleDialogOpen(false);
        notifyPuzzleSolved(title ?? "");
        onSolved?.(title ?? null);
      }, 400);
    } else {
      const { correctedCount, newlyCompletedRows, newlyCompletedCols } = checkForHints();
      if (correctedCount > 0) {
        showHintMessage("Cleaning 🧼");
        return;
      }
      if (newlyCompletedRows > 0 || newlyCompletedCols > 0) {
        const rowText =
          newlyCompletedRows > 0
            ? `${newlyCompletedRows} ${newlyCompletedRows === 1 ? "row" : "rows"}`
            : "";
        const colText =
          newlyCompletedCols > 0
            ? `${newlyCompletedCols} ${newlyCompletedCols === 1 ? "column" : "columns"}`
            : "";
        const joiner = rowText && colText ? " and " : "";
        showHintMessage(`Completed ${rowText}${joiner}${colText}. Nice work!`);
        return;
      }
      showHintMessage("Nothing to do, keep going!");
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && open) {
          persistState();
        }
        setOpen(nextOpen);
        notifyPuzzleDialogOpen(nextOpen);
      }}
    >
      <Dialog.Trigger asChild>
        <div className={cn("cursor-pointer", className)}>
          <Pixel svg={triggerSvg} size={size} />
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm data-[state=open]:animate-overlayShow z-40" />
        <Dialog.Content className="fixed left-1/2 overflow-clip top-1/2 -translate-x-1/2 -translate-y-1/2 bg-page-background rounded-3xl shadow-lg z-50">
          <Dialog.Description className="sr-only">Puzzle modal</Dialog.Description>
          <PuzzleDialogHeader complete={complete} title={title} />
          <Container className="overflow-y-scroll py-10 px-20! flex flex-col items-center gap-10">
            <div className="grid gap-2">
              <ColumnClues colClues={colClues} checkedCompletedCols={checkedCompletedCols} />
              <RowClues rowClues={rowClues} checkedCompletedRows={checkedCompletedRows} />
              <div className="relative">
                <div
                  className={cn(
                    "grid outline-3 cursor-pointer hover:shadow-custom",
                    showGuides && "outline-b-2 outline-r-2 border-gray-400",
                  )}
                  onPointerLeave={() => setHoverCell(null)}
                  onPointerDown={(event) => {
                    if (event.pointerType === "mouse" && event.button !== 0) return;
                    const cell = getCellFromElement(event.target as Element);
                    if (!cell) return;
                    dragActiveRef.current = true;
                    dragMovedRef.current = false;
                    dragPaintedStartRef.current = false;
                    dragPointerIdRef.current = event.pointerId;
                    dragStartCellRef.current = cell;
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }}
                  onPointerMove={(event) => {
                    if (event.pointerType === "mouse") {
                      const hover = getCellFromElement(event.target as Element);
                      if (hover) setHoverCell(hover);
                    }
                    if (!dragActiveRef.current) return;
                    if (dragPointerIdRef.current !== event.pointerId) return;
                    const element = document.elementFromPoint(event.clientX, event.clientY);
                    const cell = getCellFromElement(element);
                    if (!cell) return;
                    dragMovedRef.current = true;
                    if (!dragPaintedStartRef.current && dragStartCellRef.current) {
                      paintCell(dragStartCellRef.current.r, dragStartCellRef.current.c);
                      dragPaintedStartRef.current = true;
                    }
                    paintCell(cell.r, cell.c);
                  }}
                  onPointerUp={(event) => {
                    if (dragPointerIdRef.current !== event.pointerId) return;
                    if (!dragMovedRef.current && dragStartCellRef.current) {
                      handleCellClick(dragStartCellRef.current.r, dragStartCellRef.current.c);
                    }
                    dragActiveRef.current = false;
                    dragMovedRef.current = false;
                    dragPointerIdRef.current = null;
                    dragStartCellRef.current = null;
                    dragPaintedStartRef.current = false;
                  }}
                  onPointerCancel={(event) => {
                    if (dragPointerIdRef.current !== event.pointerId) return;
                    dragActiveRef.current = false;
                    dragMovedRef.current = false;
                    dragPointerIdRef.current = null;
                    dragStartCellRef.current = null;
                    dragPaintedStartRef.current = false;
                  }}
                  style={{
                    gridTemplateRows: `repeat(${rows}, 20px)`,
                    gridTemplateColumns: `repeat(${cols}, 20px)`,
                    touchAction: "none",
                  }}
                >
                  {solutionGrid.map((row: GridCell[], r: number) =>
                    row.map((_: GridCell, c: number) => (
                      <PuzzleGridCell
                        key={`${r}-${c}`}
                        row={r}
                        col={c}
                        state={gridState[r][c]}
                        target={solutionGrid[r][c] as string}
                        solutionGrid={solutionGrid}
                        showGuides={showGuides}
                        hoverCell={hoverCell}
                        onCellClick={handleCellClick}
                        onCellRightClick={handleCellRightClick}
                        onPointerEnter={(r, c) => setHoverCell({ r, c })}
                        onDoubleClick={() =>
                          setPaintMode((prevMode) => (prevMode === "fill" ? "cross" : "fill"))
                        }
                      />
                    )),
                  )}
                </div>
                {hintMessage && (
                  <div
                    className={cn(
                      "absolute left-1/2 top-full mt-4 -translate-x-1/2 text-center transition-opacity duration-300",
                      hintVisible ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <Text styleType="body-md">{hintMessage}</Text>
                  </div>
                )}
              </div>
            </div>
          </Container>
          <PuzzleDialogFooter
            showGuides={showGuides}
            onToggleGuides={() => setShowGuides(!showGuides)}
            onCheckHints={handleCheckHints}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
