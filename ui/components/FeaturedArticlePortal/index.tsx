"use client";

import { LockIcon, LockOpenIcon } from "lucide-react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import { useEffect, useRef, useState } from "react";

import { useAppUi } from "@/app/components/AppUiContext";
import { getArticleShellLayoutId, getArticleTextLayoutId } from "@/app/constants/motion";
import { DOM_IDS } from "@/app/constants/ui";
import type { FeaturedArticle } from "@/app/types/sanity";
import { getFeaturedArticleUnlockStorageKey } from "@/app/utils/puzzle";

import { Text } from "@/ui/atoms/Text";
import { Container } from "@/ui/global/Container";

import {
  cardVariants,
  iconVariants,
  overlayVariants,
  textContainerVariants,
  textItemVariants,
} from "./constants";

interface FeaturedArticlePortalProps {
  article: FeaturedArticle;
}

export const FeaturedArticlePortal = ({ article }: FeaturedArticlePortalProps) => {
  const { unlockedArticleStorageKeys } = useAppUi();

  const portalRootRef = useRef<HTMLDivElement>(null);

  const isScrollRevealed = useInView(portalRootRef, { amount: 0.6 });
  const [isHovered, setIsHovered] = useState(false);
  const revealState = isScrollRevealed || isHovered ? "revealed" : "hidden";

  const articleSlug = article.slug ?? "";
  const articleHref = articleSlug ? `/article/${articleSlug}` : "#";
  const shellLayoutId = articleSlug ? getArticleShellLayoutId(articleSlug) : undefined;
  const textLayoutId = articleSlug ? getArticleTextLayoutId(articleSlug) : undefined;

  const coverImageUrl = article.coverImage?.asset?.url ?? null;
  const title = article.title ?? "Featured article";

  const unlockStorageKey = getFeaturedArticleUnlockStorageKey(article);
  const [isUnlocked, setIsUnlocked] = useState(!article.isPrivate);
  const showUnlocked =
    !article.isPrivate || isUnlocked || unlockedArticleStorageKeys.has(unlockStorageKey);

  useEffect(() => {
    if (!article.isPrivate) {
      setIsUnlocked(true);
      return;
    }

    const updateUnlockState = () => {
      setIsUnlocked(localStorage.getItem(unlockStorageKey) === "true");
    };

    updateUnlockState();

    window.addEventListener("focus", updateUnlockState);
    window.addEventListener("storage", updateUnlockState);

    return () => {
      window.removeEventListener("focus", updateUnlockState);
      window.removeEventListener("storage", updateUnlockState);
    };
  }, [article.isPrivate, unlockStorageKey]);

  return (
    <Container
      id={DOM_IDS.exploreSection}
      ref={portalRootRef}
      data-component="FeaturedArticlePortal"
    >
      <motion.div
        layoutId={shellLayoutId}
        initial="hidden"
        animate={revealState}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        variants={cardVariants}
        className="group relative h-full overflow-hidden rounded-4xl border border-black/10 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.16)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_24px_70px_rgba(0,0,0,0.22)] max-w-[1200px] mx-auto hover:scale-100"
      >
        <Link
          className="cursor-zoom-in block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/45 focus-visible:ring-offset-4"
          href={articleHref}
          aria-label={`Open ${stegaClean(title)}`}
        >
          <div className="relative h-full w-full aspect-4/5 lg:aspect-video">
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt={title}
                fill
                loading="eager"
                sizes="(min-width: 768px) 80vw, 100vw"
                className="object-cover"
              />
            ) : null}

            <motion.div
              aria-hidden="true"
              variants={overlayVariants}
              animate={revealState}
              className="absolute inset-0 bg-linear-to-t from-black/70 via-black/75 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-black/18 bg-linear-to-t from-black/70 via-black/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <motion.div
              layoutId={textLayoutId}
              variants={textContainerVariants}
              initial="hidden"
              animate={revealState}
              className="absolute right-0 bottom-0 z-10 flex max-w-3xl flex-col items-end gap-3 p-6 pt-24 text-right text-white md:p-8 md:pt-32"
            >
              <motion.p
                variants={textItemVariants}
                className="text-xs font-medium uppercase tracking-[0.22em] text-white/70"
              >
                Featured article
              </motion.p>
              {/* <motion.div variants={textItemVariants}> */}
              <Text as="h2" styleType="heading-xl">
                {title}
              </Text>
              {/* </motion.div> */}
              {article.excerpt && (
                <motion.p
                  variants={textItemVariants}
                  className="max-w-2xl overflow-hidden [display:-webkit-box] text-sm leading-6 text-white/82 [-webkit-box-orient:vertical] [-webkit-line-clamp:3] md:text-base md:leading-7"
                >
                  {article.excerpt}
                </motion.p>
                // <Text as="p" styleType="body-md" className="line-clamp-3">
                //   {article.excerpt}
                // </Text>
              )}
            </motion.div>

            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate={revealState}
              className="absolute top-5 right-5 z-20 grid size-11 place-items-center rounded-full bg-black/25 text-white opacity-0 backdrop-blur-md transition-colors duration-300 group-hover:bg-black/45 group-hover:opacity-100 md:top-7 md:right-7 md:size-12"
              aria-hidden="true"
            >
              {showUnlocked ? (
                <LockOpenIcon className="size-5 transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <LockIcon className="size-5 transition-transform duration-300 group-hover:scale-110" />
              )}
            </motion.div>
          </div>
        </Link>
      </motion.div>
    </Container>
  );
};
