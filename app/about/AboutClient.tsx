"use client";

import { useRouter } from "next/navigation";
import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { useState } from "react";

import { Button } from "../components/Button/Button";
import { PuzzleDialog } from "../components/PuzzleDialog";

export default function AboutClient({
  title,
  pixelPuzzle,
  closeIcon,
  intro,
}: {
  title?: string;
  pixelPuzzle?: {
    title?: string;
    svg?: string;
    json?: string;
  };
  closeIcon?: {
    title?: string;
    svg?: string;
  };
  intro?: string;
}) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [theme, setTheme] = useState<"normal" | "shiny">("normal");
  const [solved, setSolved] = useState(false);

  const svgMarkup = pixelPuzzle?.svg;
  const solutionSource = pixelPuzzle?.json ?? pixelPuzzle?.svg;
  const hasPuzzle = !!solutionSource;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === process.env.NEXT_PUBLIC_ABOUT_PASSWORD) {
      setIsUnlocked(true);
      setError("");
      localStorage.setItem("aboutUnlocked", "true");
      router.push("/about/cv");
    } else {
      setError("OOps. Did you find the hidden clue?");
    }
  };

  function handlePuzzleSolved() {
    const correctPassword = process.env.NEXT_PUBLIC_ABOUT_PASSWORD || "";
    setPassword(correctPassword);
    setError("");
  }

  return (
    <div>
      {hasPuzzle && (
        <PuzzleDialog
          title={pixelPuzzle?.title}
          svg={svgMarkup}
          solution={solutionSource}
          closeIcon={closeIcon}
          onSolved={() => setSolved(true)}
          size={100}
        />
      )}
      <div className="bg-black/90 text-white p-10 rounded-3xl">
        <h1 className="text-2xl font-heading mb-4 uppercase">{title ?? "Welcome"}</h1>
        {!isUnlocked && (
          <p className="text-sm mb-6">
            {intro ?? "Enter the password or look around for clues 👀"}
          </p>
        )}
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
  );
}
