"use client";

import { Pixel } from "@/studio/sanity.types";
import { useState } from "react";

interface SectionHeaderProps {
  heading?: string;
  intro: string | null;
  pixelPuzzle?: Pixel;
  closeIcon?: {
    title?: string;
    svg?: string;
  };
  playIcon?: {
    title?: string;
    svg?: string;
  };
}

export const SectionHeader = ({
  heading,
  intro,
  pixelPuzzle,
  closeIcon,
  playIcon,
}: SectionHeaderProps) => {
  const [solved, setSolved] = useState(false);

  const svgMarkup = pixelPuzzle?.svg;
  const solutionSource = pixelPuzzle?.json ?? pixelPuzzle?.svg;
  const hasPuzzle = !!solutionSource;

  return (
    <div className="flex flex-col gap-20 justify-center items-center text-center">
      <div className="flex items-center">
        {/* {hasPuzzle && (
          <PuzzleDialog
            title={pixelPuzzle?.title}
            svg={svgMarkup}
            solution={solutionSource}
            closeIcon={closeIcon}
            onSolved={() => setSolved(true)}
            size={100}
          />
        )} */}
        <div className="flex flex-col items-center gap-8">
          <h1 className="font-heading uppercase text-5xl md:text-9xl text-background">
            {heading ?? "Odd Ones"}
          </h1>
          {intro && (
            <p className="max-w-[500px]" style={{ color: "var(--foreground-contrast)" }}>
              {intro}
            </p>
          )}
        </div>
        {/* {hasPuzzle && (
          <PuzzleDialog
            title={pixelPuzzle?.title}
            svg={svgMarkup}
            solution={solutionSource}
            closeIcon={closeIcon}
            onSolved={() => setSolved(true)}
            size={100}
          />
        )} */}
      </div>
    </div>
  );
};
