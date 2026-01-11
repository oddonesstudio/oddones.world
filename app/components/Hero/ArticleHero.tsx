"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { tv } from "tailwind-variants";
import { Button } from "../Button/Button";

const styles = tv({
  slots: {
    base: "relative h-[900px] w-full overflow-hidden flex items-center justify-center",
    media: "object-cover object-center bg-black/20",
    overlay: "absolute inset-0 bg-black/45",
    content: "relative z-10 flex flex-col text-white text-center max-w-100",
  },
});

interface ArticleHeroProps {
  title: string | null;
  coverImage?: string;
  excerpt: string | null;
  primaryCta?: {
    label?: string;
    type?: string;
  };
}

export const ArticleHero = ({ title, coverImage, excerpt, primaryCta }: ArticleHeroProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const objectPosition = useTransform(scrollYProgress, [0, 1], ["center 0", "center 100%"]);

  const { base, media, overlay, content } = styles();

  const MotionImage = motion.create(Image);

  return (
    <section ref={ref} className={base()} data-component="Article Hero">
      {coverImage && (
        <MotionImage
          src={coverImage}
          alt={title ?? ""}
          fill
          priority
          className={media()}
          style={{ objectPosition }}
        />
      )}

      <div className={overlay()} aria-hidden="true" />

      <div className={content()}>
        <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg font-heading uppercase">
          {title}
        </h1>
        {excerpt && <p className="mt-4 max-w-2xl mx-auto text-lg drop-shadow">{excerpt}</p>}
        {primaryCta?.label && <Button label={primaryCta.label} />}
      </div>
    </section>
  );
};
