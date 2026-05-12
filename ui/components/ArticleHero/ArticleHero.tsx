"use client";

import { Download } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useAppUi } from "@/app/components/AppUiContext";
import { Z_INDEX_CLASS } from "@/app/constants/ui";
import { usePuzzleSolved } from "@/app/hooks/usePuzzleSolved";
import type { PixelPuzzle } from "@/app/types/sanity";

import { tv } from "@/ui/_lib/utils";
import { Button, type ButtonAction } from "@/ui/atoms/Button";
import { Text } from "@/ui/atoms/Text";
import { PuzzleDialog } from "@/ui/global/PuzzleDialog";

interface ArticleHeroProps {
  title: string | null;
  coverImage?: string;
  excerpt: string | null;
  category?: {
    title: string | null;
    slug?: string | null;
  } | null;
  pixel?: PixelPuzzle | null;
  textLayoutId?: string;
  primaryCTA?: {
    label?: string | null;
    href?: string;
    action?: ButtonAction | null;
  } | null;
  secondaryCTA?: {
    label?: string | null;
    href?: string;
    action?: ButtonAction | null;
  } | null;
  isPrivate?: boolean;
  unlockStorageKey?: string;
  imageSizes?: string;
}

const styles = tv({
  slots: {
    base: "relative flex min-h-full h-dvh w-full items-center justify-center overflow-hidden bg-black px-6 text-white",
    content: `relative ${Z_INDEX_CLASS.local} mx-auto flex w-full max-w-sm md:max-w-md lg:max-w-2xl flex-col items-center justify-center gap-6 text-center`,
  },
});

export const ArticleHero = ({
  title,
  coverImage,
  excerpt,
  category,
  pixel,
  textLayoutId,
  primaryCTA,
  secondaryCTA,
  isPrivate = false,
  unlockStorageKey,
  imageSizes = "100vw",
}: ArticleHeroProps) => {
  const { unlockedArticleStorageKeys } = useAppUi();
  const { handlePuzzleSolved } = usePuzzleSolved();
  const [storageUnlocked, setStorageUnlocked] = useState(!isPrivate);
  const svgMarkup = pixel?.artwork ?? undefined;
  const solutionSource = pixel?.json ?? pixel?.artwork;
  const articleUnlocked =
    !isPrivate ||
    storageUnlocked ||
    (unlockStorageKey ? unlockedArticleStorageKeys.has(unlockStorageKey) : false);
  const hasPuzzle = !!solutionSource && !articleUnlocked;

  const { base, content } = styles();

  useEffect(() => {
    if (!unlockStorageKey) {
      setStorageUnlocked(!isPrivate);
      return;
    }

    setStorageUnlocked(localStorage.getItem(unlockStorageKey) === "true");
  }, [isPrivate, unlockStorageKey]);

  return (
    <section className={base()} data-component="Article Hero">
      {coverImage && (
        <Image
          src={coverImage}
          alt={title ?? ""}
          fill
          priority
          loading="eager"
          sizes={imageSizes}
          className="object-cover opacity-45 saturate-0"
        />
      )}

      {/* <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_34%,rgba(0,0,0,0.88)_78%),linear-gradient(180deg,rgba(0,0,0,0.36)_0%,rgba(0,0,0,0.12)_45%,rgba(0,0,0,0.9)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] bg-size-[4px_4px]"
      /> */}

      <motion.div layoutId={textLayoutId} className={content()}>
        {hasPuzzle && (
          <PuzzleDialog
            title={pixel?.title}
            svg={svgMarkup}
            solution={solutionSource}
            onSolved={handlePuzzleSolved}
            size={100}
          />
        )}
        <Text as="p" styleType="label-sm" className="text-white/70">
          {category?.title ?? "Featured article"}
        </Text>
        <Text as="h1" styleType="heading-xl" className="max-w-[80vw]">
          {title}
        </Text>
        {excerpt && (
          <Text as="p" styleType="body-md" className="max-w-lg text-white/70">
            {excerpt}
          </Text>
        )}
        {(primaryCTA?.label || secondaryCTA?.label) && (
          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {primaryCTA?.label && (
                <Button
                  variant="outline-inverse"
                  label={primaryCTA.label}
                  href={primaryCTA.href}
                  action={primaryCTA.action}
                  iconLeft={
                    primaryCTA.action === "download" ? (
                      <Download size={18} strokeWidth={1.75} />
                    ) : undefined
                  }
                  iconRight={primaryCTA.action === "download" ? false : undefined}
                  className="min-w-[280px] justify-center rounded-lg py-4"
                />
              )}
              {secondaryCTA?.label && (
                <Button
                  label={secondaryCTA.label}
                  variant="secondary"
                  href={secondaryCTA.href}
                  action={secondaryCTA.action}
                />
              )}
            </div>
            {/* {primaryCTA?.action === "download" ? (
              <Text
                as="p"
                styleType="body-sm"
                className="uppercase tracking-[0.2em] text-page-background/45"
              >
                PDF download
              </Text>
            ) : null} */}
          </div>
        )}
      </motion.div>
      <motion.div
        className="absolute bottom-0 mb-4 flex flex-col items-center gap-2 text-white/70"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.24em]">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/25">
          <span className="absolute left-0 top-0 h-4 w-px animate-bounce bg-white/80" />
        </span>
      </motion.div>
    </section>
  );
};
