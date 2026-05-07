"use client";

import { motion } from "motion/react";
import Image from "next/image";

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
  imageSizes?: string;
}

const styles = tv({
  slots: {
    base: "relative h-screen min-h-full w-full overflow-hidden flex items-center justify-center",
    content:
      "absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-center max-w-[80vw] mx-auto text-white",
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
  imageSizes = "100vw",
}: ArticleHeroProps) => {
  const { handlePuzzleSolved } = usePuzzleSolved();
  const svgMarkup = pixel?.artwork ?? undefined;
  const solutionSource = pixel?.json ?? pixel?.artwork;
  const hasPuzzle = !!solutionSource;

  const { base, content } = styles();

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
          className="object-cover"
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/70 via-black/75 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/18 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

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
        <Text as="p" styleType="label-md" className="opacity-70">
          {category?.title ?? "Featured article"}
        </Text>
        <Text as="h1" styleType="heading-xl" className="max-w-2xl">
          {title}
        </Text>
        {excerpt && (
          <Text as="p" styleType="body-md" className="opacity-70 max-w-xl">
            {excerpt}
          </Text>
        )}
        {(primaryCTA?.label || secondaryCTA?.label) && (
          <div className="flex max-md:flex-col gap-4">
            {primaryCTA?.label && (
              <Button
                variant="primary-inverse"
                label={primaryCTA.label}
                href={primaryCTA.href}
                action={primaryCTA.action}
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
