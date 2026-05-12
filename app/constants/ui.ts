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

export const Z_INDEX_CLASS = {
  localBase: "z-[1]",
  local: "z-10",
  localOverlay: "z-20",
  gate: "z-30",
  headerUnderModal: "z-30",
  modalSlot: "z-40",
  modalOverlay: "z-40",
  modalContent: "z-50",
  pageChrome: "z-50",
  fullscreenModal: "z-[60]",
  headerOverModal: "z-[70]",
  popover: "z-[80]",
  modalControls: "z-[90]",
  previewBanner: "z-[1000]",
} as const;
