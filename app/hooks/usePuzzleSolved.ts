"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { useAppUi } from "@/app/components/AppUiContext";
import type { FeaturedArticle } from "@/app/types/sanity";
import { unlockFeaturedArticleForPuzzle } from "@/app/utils/puzzle";

export function usePuzzleSolved(featuredArticle?: FeaturedArticle | null) {
  const router = useRouter();
  const { notifyArticleUnlocked } = useAppUi();

  const handlePuzzleSolved = useCallback(() => {
    const articleHref = unlockFeaturedArticleForPuzzle({
      featuredArticle,
      notifyArticleUnlocked,
    });

    if (articleHref) router.push(articleHref);
  }, [featuredArticle, notifyArticleUnlocked, router]);

  return { handlePuzzleSolved };
}
