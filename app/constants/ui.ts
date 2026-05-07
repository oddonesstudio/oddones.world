export const STORAGE_KEYS = {
  themeColor: "themeColor",
  articleUnlock: (articleId: string) => `article:${articleId}`,
  puzzleState: (title?: string | null) => `puzzle:${title ?? "untitled"}`,
} as const;

export const LAYOUT_IDS = {
  articleRouteTransition: "article-route-transition",
  articleShell: (slug: string) => `article-shell:${slug}`,
  articleText: (slug: string) => `article-text:${slug}`,
} as const;

export const DOM_IDS = {
  modalRoot: "modal-root",
  exploreSection: "explore",
} as const;
