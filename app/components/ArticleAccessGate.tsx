"use client";

import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { useEffect, useState } from "react";

import { Button } from "@/app/components/Button/Button";
import { PuzzleDialog } from "@/app/components/PuzzleDialog";

type PixelPuzzle = {
  title?: string;
  svg?: string;
  json?: string;
};

type ArticleAccessGateProps = {
  intro: string | null;
  pixelPuzzle?: PixelPuzzle;
  closeIcon?: {
    title?: string;
    svg?: string;
  };
  storageKey: string;
};

export default function ArticleAccessGate({
  intro,
  pixelPuzzle,
  closeIcon,
  storageKey,
}: ArticleAccessGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const svgMarkup = pixelPuzzle?.svg;
  const solutionSource = pixelPuzzle?.json ?? pixelPuzzle?.svg;
  const hasPuzzle = !!solutionSource;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "true") {
      setIsUnlocked(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (isUnlocked) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isUnlocked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const expectedPassword = process.env.NEXT_PUBLIC_ABOUT_PASSWORD ?? "";
    if (password === expectedPassword) {
      setIsUnlocked(true);
      setError("");
      localStorage.setItem(storageKey, "true");
    } else {
      setError("OOps. Did you find the hidden clue?");
    }
  };

  const handlePuzzleSolved = () => {
    const correctPassword = process.env.NEXT_PUBLIC_ABOUT_PASSWORD ?? "";
    setPassword(correctPassword);
    setError("");
  };

  if (isUnlocked) return null;

  return (
    <div className="absolute inset-0 z-30 flex justify-center px-6 py-16 h-screen items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        {hasPuzzle && (
          <PuzzleDialog
            title={pixelPuzzle?.title}
            svg={svgMarkup}
            solution={solutionSource}
            closeIcon={closeIcon}
            onSolved={handlePuzzleSolved}
            size={100}
          />
        )}
        <div className="bg-black/90 text-white p-10 rounded-3xl w-full">
          <h1 className="text-2xl font-heading mb-4 uppercase">Welcome</h1>
          <p className="text-sm mb-6">
            {intro ?? "Enter the password or look around for clues 👀"}
          </p>
          <form onSubmit={handleSubmit} className="relative flex flex-col gap-6">
            <PasswordToggleField.Root>
              <PasswordToggleField.Input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md focus:outline-none bg-white text-black"
              />
              <PasswordToggleField.Toggle className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300">
                <PasswordToggleField.Slot visible="🙊" hidden="🙈" />
              </PasswordToggleField.Toggle>
            </PasswordToggleField.Root>
            <Button type="submit" label="Enter" variant="secondary" />
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
