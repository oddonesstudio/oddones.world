"use client";

import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import type { CSSProperties, FormEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAppUi } from "@/app/components/AppUiContext";

import { tv } from "@/ui/_lib/utils";
import { Button } from "@/ui/atoms/Button";
import { Text } from "@/ui/atoms/Text";

const styles = tv({
  slots: {
    gateBase:
      "absolute inset-0 z-30 flex h-full items-center justify-center px-6 py-16 pointer-events-none",
    gateOverlay:
      "absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-none transition-[mask-image] duration-150",
    gateWrapper:
      "relative z-10 flex flex-col items-center gap-8 p-6 text-page-background pointer-events-auto",
    gateForm: "flex w-full max-w-[400px] flex-col items-center gap-6",
    gateMobileHint: "max-w-[360px] text-center text-sm leading-6 text-page-background/75 md:hidden",
  },
});

export type ArticleGateConfig = {
  pixelTitle?: string;
  storageKey: string;
  title?: string;
};

type ArticleModalGateProps = ArticleGateConfig & {
  onUnlock: () => void;
};

export function ArticleModalGate({
  onUnlock,
  pixelTitle,
  storageKey,
  title = "Locked article",
}: ArticleModalGateProps) {
  const { notifyArticleUnlocked, puzzleDialogOpen, puzzleSolved } = useAppUi();
  const [password, setPassword] = useState("");
  const [hasSolvedPuzzle, setHasSolvedPuzzle] = useState(false);
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [spotlightActive, setSpotlightActive] = useState(false);
  const [spotlightEnabled, setSpotlightEnabled] = useState(false);
  const [needsMobilePuzzleHint, setNeedsMobilePuzzleHint] = useState(false);
  const handledPuzzleSolvedVersion = useRef(puzzleSolved.version);
  const baseRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const expectedPassword = pixelTitle?.trim() ?? "";

  const unlockArticle = useCallback(() => {
    setIsUnlocked(true);
    setError("");
    localStorage.setItem(storageKey, "true");
    onUnlock();
    notifyArticleUnlocked(storageKey);
  }, [notifyArticleUnlocked, onUnlock, storageKey]);

  useEffect(() => {
    const unlocked = localStorage.getItem(storageKey) === "true";
    setIsUnlocked(unlocked);
    if (unlocked) {
      onUnlock();
    }
  }, [onUnlock, storageKey]);

  useEffect(() => {
    if (isUnlocked) return;
    const el = baseRef.current;
    if (!el) return;

    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mobileMedia = window.matchMedia("(hover: none), (pointer: coarse)");
    const updateMedia = () => {
      setSpotlightEnabled(media.matches);
      setNeedsMobilePuzzleHint(mobileMedia.matches);
    };
    updateMedia();
    media.addEventListener("change", updateMedia);
    mobileMedia.addEventListener("change", updateMedia);

    const setPosition = (x: number, y: number) => {
      el.style.setProperty("--reveal-x", `${x}px`);
      el.style.setProperty("--reveal-y", `${y}px`);
    };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      if (!media.matches) return;
      const rect = el.getBoundingClientRect();
      setPosition(event.clientX - rect.left, event.clientY - rect.top);

      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const wrapperRect = wrapper.getBoundingClientRect();
      const inside =
        event.clientX >= wrapperRect.left &&
        event.clientX <= wrapperRect.right &&
        event.clientY >= wrapperRect.top &&
        event.clientY <= wrapperRect.bottom;

      setSpotlightActive(!inside);
    };

    const rect = el.getBoundingClientRect();
    setPosition(rect.width * 0.5, rect.height * 0.42);
    setSpotlightActive(false);

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      media.removeEventListener("change", updateMedia);
      mobileMedia.removeEventListener("change", updateMedia);
    };
  }, [isUnlocked]);

  useEffect(() => {
    if (isUnlocked) return;
    if (handledPuzzleSolvedVersion.current === puzzleSolved.version) return;

    handledPuzzleSolvedVersion.current = puzzleSolved.version;
    const nextPassword = puzzleSolved.password;
    setPassword(nextPassword);
    setHasSolvedPuzzle(true);
    setError("");

    if (expectedPassword === "" || nextPassword.trim() === expectedPassword) {
      unlockArticle();
    }
  }, [expectedPassword, isUnlocked, puzzleSolved, unlockArticle]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const enteredPassword = password.trim();
    const inputMatchesPixelTitle = expectedPassword !== "" && enteredPassword === expectedPassword;

    if (hasSolvedPuzzle || inputMatchesPixelTitle) {
      unlockArticle();
      return;
    }

    setError("Did you find the hidden puzzle?");
  };

  if (isUnlocked) return null;

  const { gateBase, gateForm, gateMobileHint, gateOverlay, gateWrapper } = styles();
  const shouldReveal = spotlightEnabled && spotlightActive && !puzzleDialogOpen;

  return (
    <div
      ref={baseRef}
      className={gateBase()}
      style={
        {
          "--reveal-x": "50%",
          "--reveal-y": "40%",
          "--reveal-size": "80px",
        } as CSSProperties
      }
    >
      <div
        className={gateOverlay()}
        style={{
          WebkitMaskImage: shouldReveal
            ? "radial-gradient(circle var(--reveal-size) at var(--reveal-x) var(--reveal-y), transparent 0, transparent 55%, black 100%)"
            : "none",
          maskImage: shouldReveal
            ? "radial-gradient(circle var(--reveal-size) at var(--reveal-x) var(--reveal-y), transparent 0, transparent 55%, black 100%)"
            : "none",
        }}
      />
      <div ref={wrapperRef} className={gateWrapper()}>
        <Text as="h1" styleType="heading-xl">
          {title}
        </Text>
        {needsMobilePuzzleHint ? (
          <p className={gateMobileHint()}>
            Open this article on desktop to reveal the hidden puzzle, then enter the password here.
          </p>
        ) : null}
        <form onSubmit={handleSubmit} className={gateForm()}>
          <div className="relative w-full">
            <PasswordToggleField.Root>
              <PasswordToggleField.Input
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-14 w-full rounded-full border border-white/15 bg-white/10 px-6 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl focus:outline-none"
              />
              <PasswordToggleField.Toggle className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer">
                <PasswordToggleField.Slot visible={<EyeIcon />} hidden={<EyeClosedIcon />} />
              </PasswordToggleField.Toggle>
            </PasswordToggleField.Root>
          </div>
          <Button type="submit" label="Unlock" variant="primary-inverse" />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}
