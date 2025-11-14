"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { useState } from "react";

import { Button } from "../components/Button/Button";
import { PageWrapper } from "../components/PageWrapper";
import { PuzzleDialog } from "../components/PuzzleDialog";

import { generateSolutionFromSvg } from "../utils/generateSolutionFromSvg";
import { getMaskUrl } from "../utils/getMaskUrl";

export default function AboutClient({
  title,
  pixelPuzzle,
  intro,
}: {
  title?: string;
  pixelPuzzle?: {
    title: string;
    svg: string;
  };
  intro?: string;
}) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

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

  const maskUrl = pixelPuzzle && getMaskUrl(pixelPuzzle.svg);
  const solution = pixelPuzzle ? generateSolutionFromSvg(pixelPuzzle.svg) : [];

  return (
    <PageWrapper>
      <div className="relative bg-black p-6 h-screen overflow-hidden">
        <div className="relative h-full w-full rounded-3xl overflow-hidden">
          <Image
            src="/images/golden-wonder.webp"
            alt="Lush background"
            fill
            priority
            className="object-cover"
          />
          <div
            className="absolute top-1/2 right-1/5 w-[400px] h-[400px] -translate-y-1/2 group z-20 cursor-pointer bg-pink"
            style={{
              WebkitMaskImage: maskUrl,
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              WebkitMaskSize: "contain",
              maskImage: maskUrl,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-80">
              <PuzzleDialog solution={solution} onSolved={handlePuzzleSolved} />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
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
        </div>
      </div>
    </PageWrapper>
  );
}
