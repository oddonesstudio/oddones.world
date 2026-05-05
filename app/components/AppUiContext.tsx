"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

type ArticleModalState = {
  expanded: boolean;
  navHidden: boolean;
  open: boolean;
  scrollTop: number;
};

type PuzzleSolvedState = {
  password: string;
  version: number;
};

type ErrorFallbackCopy = {
  actionLabel?: string | null;
  description?: string | null;
  title?: string | null;
};

type AppUiContextValue = {
  articleModal: ArticleModalState;
  errorFallback: ErrorFallbackCopy | null;
  unlockedArticleStorageKeys: ReadonlySet<string>;
  logoTabHoverRequestId: number;
  puzzleDialogOpen: boolean;
  puzzleSolved: PuzzleSolvedState;
  notifyArticleUnlocked: (storageKey: string) => void;
  notifyLogoTabHover: () => void;
  notifyPuzzleDialogOpen: (open: boolean) => void;
  notifyPuzzleSolved: (password?: string | null) => void;
  setArticleModalState: (state: Partial<ArticleModalState>) => void;
};

const AppUiContext = createContext<AppUiContextValue | null>(null);

export function AppUiProvider({
  children,
  errorFallback = null,
}: {
  children: ReactNode;
  errorFallback?: ErrorFallbackCopy | null;
}) {
  const [articleModal, setArticleModal] = useState<ArticleModalState>({
    expanded: false,
    navHidden: false,
    open: false,
    scrollTop: 0,
  });
  const [unlockedArticleStorageKeys, setUnlockedArticleStorageKeys] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [logoTabHoverRequestId, setLogoTabHoverRequestId] = useState(0);
  const [puzzleDialogOpen, setPuzzleDialogOpen] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState<PuzzleSolvedState>({
    password: "",
    version: 0,
  });

  const setArticleModalState = useCallback((state: Partial<ArticleModalState>) => {
    setArticleModal((current) => ({ ...current, ...state }));
  }, []);

  const notifyArticleUnlocked = useCallback((storageKey: string) => {
    setUnlockedArticleStorageKeys((current) => new Set(current).add(storageKey));
  }, []);

  const notifyLogoTabHover = useCallback(() => {
    setLogoTabHoverRequestId((requestId) => requestId + 1);
  }, []);

  const notifyPuzzleDialogOpen = useCallback((open: boolean) => {
    setPuzzleDialogOpen(open);
  }, []);

  const notifyPuzzleSolved = useCallback((password?: string | null) => {
    setPuzzleSolved((current) => ({
      password: password ?? "",
      version: current.version + 1,
    }));
  }, []);

  const value = useMemo(
    () => ({
      articleModal,
      errorFallback,
      logoTabHoverRequestId,
      notifyArticleUnlocked,
      notifyLogoTabHover,
      notifyPuzzleDialogOpen,
      notifyPuzzleSolved,
      puzzleDialogOpen,
      puzzleSolved,
      setArticleModalState,
      unlockedArticleStorageKeys,
    }),
    [
      articleModal,
      errorFallback,
      logoTabHoverRequestId,
      notifyArticleUnlocked,
      notifyLogoTabHover,
      notifyPuzzleDialogOpen,
      notifyPuzzleSolved,
      puzzleDialogOpen,
      puzzleSolved,
      setArticleModalState,
      unlockedArticleStorageKeys,
    ],
  );

  return <AppUiContext.Provider value={value}>{children}</AppUiContext.Provider>;
}

export function useAppUi() {
  const context = useContext(AppUiContext);
  if (!context) {
    throw new Error("useAppUi must be used within AppUiProvider");
  }
  return context;
}
