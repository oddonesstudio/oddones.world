import { STORAGE_KEYS } from "@/app/constants/ui";
import type { FeaturedArticle } from "@/app/types/sanity";

interface ArticleUnlockStorageKeyParams {
  pixelTitle?: string | null;
  slug?: string | null;
}

export const getArticleUnlockStorageKey = ({ pixelTitle, slug }: ArticleUnlockStorageKeyParams) =>
  STORAGE_KEYS.articleUnlock(pixelTitle ?? slug ?? "");

export const getFeaturedArticleUnlockStorageKey = (article: FeaturedArticle) =>
  getArticleUnlockStorageKey({
    pixelTitle: article.pixelPuzzle?.title,
    slug: article.slug,
  });

interface UnlockFeaturedArticleForPuzzleParams {
  featuredArticle?: FeaturedArticle | null;
  notifyArticleUnlocked: (storageKey: string) => void;
}

export const unlockFeaturedArticleForPuzzle = ({
  featuredArticle,
  notifyArticleUnlocked,
}: UnlockFeaturedArticleForPuzzleParams) => {
  const articleSlug = featuredArticle?.slug;

  if (!articleSlug) return null;

  const storageKey = getFeaturedArticleUnlockStorageKey(featuredArticle);
  localStorage.setItem(storageKey, "true");
  notifyArticleUnlocked(storageKey);

  return `/article/${articleSlug}`;
};
