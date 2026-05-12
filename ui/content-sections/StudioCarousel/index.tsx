"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { Z_INDEX_CLASS } from "@/app/constants/ui";
import type { GalleryItem, PortableTextValue } from "@/app/types/sanity";
import { Text } from "@/ui/atoms/Text";
import { PortableTextRenderer } from "@/ui/global/PortableTextRenderer/PortableTextRenderer";

interface GalleryProps {
  heading?: string;
  headingId?: string;
  summaryText?: PortableTextValue;
  items: GalleryItem[];
}

export const ArticleGallery = ({ heading, headingId, items, summaryText }: GalleryProps) => {
  const sliderRef = useRef(null);
  const [_currentSlide, setCurrentSlide] = useState(1);

  const { scrollXProgress } = useScroll({
    container: sliderRef,
  });

  const x = useTransform(scrollXProgress, [0, 1], [0, 1]);
  const objectPosition = useTransform(scrollXProgress, [0, 1], ["50%", "0%"]);
  const xRange = useTransform(scrollXProgress, [0, 1], [1, items.length]);

  useMotionValueEvent(xRange, "change", (latest) => {
    setCurrentSlide(Math.trunc(latest));
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      {heading && (
        <Text
          as="h2"
          id={headingId}
          styleType="heading-lg"
          className="mt-10 mb-6 scroll-mt-editorial"
        >
          {heading}
        </Text>
      )}
      {summaryText && <PortableTextRenderer value={summaryText} />}

      <motion.div
        ref={sliderRef}
        className="flex mt-[80px] overflow-y-hidden items-center overflow-x-scroll no-scrollba -mr-20 -ml-20"
      >
        <motion.div style={{ x }} className="flex gap-4">
          {items.map((item) => {
            const imageUrl = item.image?.asset?.url;

            return (
              <motion.div
                key={item._key}
                whileHover={{ scale: 1.025 }}
                className="relative cursor-pointer"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className={`${Z_INDEX_CLASS.local} absolute flex h-full w-full items-start justify-end bg-black/50 pt-[32px] pr-[32px] text-white`}
                >
                  {item.title && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      {item.title}
                    </div>
                  )}
                </motion.div>
                {imageUrl && (
                  <motion.figure initial={{ objectPosition: "50%" }} style={{ objectPosition }}>
                    <Image
                      src={imageUrl}
                      alt={item.title ?? "Article Gallery Image"}
                      width={500}
                      height={500}
                      sizes="500px"
                      className="object-cover max-w-[500px] h-[500px]"
                      style={{ objectPosition: "inherit" }}
                    />
                  </motion.figure>
                )}
              </motion.div>
            );
          })}
        </motion.div>
        {/* <p className="fixed bottom-14 left-1/2 -translate-x-1/2">
        <motion.span>{currentSlide}</motion.span> - {projectData.length}
      </p> */}
      </motion.div>
    </div>
  );
};
