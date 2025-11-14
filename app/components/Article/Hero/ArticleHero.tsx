"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    base: "relative h-[900px] w-full overflow-hidden flex items-center justify-center rounded-xl",
    media: "object-cover object-center bg-black/20",
  },
});

interface BlogHeroProps {
  title?: string;
  coverImage?: string;
  excerpt?: string;
}

export const BlogHero = ({ title, coverImage, excerpt }: BlogHeroProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const objectPosition = useTransform(scrollYProgress, [0, 1], ["center 0", "center 100%"]);

  const { base, media } = styles();

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

      <div className="flex flex-col text-foreground text-center">
        <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg font-heading uppercase">
          {title}
        </h1>
        {excerpt && <p className="mt-4 max-w-2xl mx-auto text-lg drop-shadow">{excerpt}</p>}
      </div>
    </section>
  );
};
