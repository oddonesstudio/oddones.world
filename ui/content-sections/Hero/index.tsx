"use client";

import { GitBranch } from "lucide-react";
import type { ReactNode } from "react";

import { usePuzzleSolved } from "@/app/hooks/usePuzzleSolved";
import type { FeaturedArticle, PixelPuzzle } from "@/app/types/sanity";

import { splitHeading } from "@/ui/_lib/splitHeading";
import { tv } from "@/ui/_lib/utils";
import { Button, type ButtonAction } from "@/ui/atoms/Button";
import { Text } from "@/ui/atoms/Text";
import { Container } from "@/ui/global/Container";
import { PuzzleDialog } from "@/ui/global/PuzzleDialog";

const styles = tv({
  slots: {
    base: "flex flex-col gap-10 md:gap-20 items-center justify-center",
    heading: "flex flex-wrap justify-center items-center relative text-center",
  },
  variants: {
    hasPixel: {
      true: {
        heading: "gap-6 md:gap-12 -space-x-20",
      },
      false: {
        heading: "-spacing-x-8",
      },
    },
  },
});

interface HeroProps {
  className?: string;
  heading?: string | null;
  intro?: string | null;
  pixel?: PixelPuzzle | null;
  featuredArticle?: FeaturedArticle | null;
  audioButton?: ReactNode;
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
}

export const Hero = (props: HeroProps) => {
  const { heading, pixel, featuredArticle, primaryCTA, secondaryCTA, audioButton } = props;
  const { handlePuzzleSolved } = usePuzzleSolved(featuredArticle);

  const svgMarkup = pixel?.artwork ?? undefined;
  const solutionSource = pixel?.json ?? pixel?.artwork;
  const hasPuzzle = !!solutionSource;
  const className = props.className;

  const { base, heading: headingClass } = styles({ hasPixel: hasPuzzle });

  return (
    <Container className={base({ className })} data-component="Hero">
      <div className="flex max-md:flex-col items-center">
        <div className={headingClass()} data-portal-threshold="hero-heading">
          {audioButton ? <span className="absolute -top-4 -right-4">{audioButton}</span> : null}
          {heading && pixel && hasPuzzle ? (
            <>
              <Text as="h1" styleType="display-xl">
                {splitHeading(heading).first}
              </Text>
              {hasPuzzle && (
                <PuzzleDialog
                  title={pixel.title}
                  svg={svgMarkup}
                  solution={solutionSource}
                  onSolved={handlePuzzleSolved}
                  size={100}
                />
              )}
              <Text as="h1" className="z-10" styleType="display-xl">
                {splitHeading(heading).second}
              </Text>
            </>
          ) : (
            <Text as="h1" styleType="display-xl">
              Odd Ones
            </Text>
          )}
        </div>
      </div>
      {props.intro && (
        <Text
          as="p"
          styleType="body-lg"
          className="text-page-foreground/70 max-w-[80vw] md:max-w-200 text-center"
        >
          {props.intro}
        </Text>
      )}
      {(primaryCTA?.label || secondaryCTA?.label) && (
        <div className="flex max-md:flex-col gap-5">
          {primaryCTA?.label && (
            <Button label={primaryCTA.label} href={primaryCTA.href} action={primaryCTA.action} />
          )}
          {secondaryCTA?.label && (
            <Button
              label={secondaryCTA.label}
              variant="secondary"
              href={secondaryCTA.href}
              action={secondaryCTA.action}
              iconRight={<GitBranch size={18} strokeWidth={1.75} />}
            />
          )}
        </div>
      )}
    </Container>
  );
};
