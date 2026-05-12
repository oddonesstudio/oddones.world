"use client";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAppUi } from "@/app/components/AppUiContext";

import { Button } from "@/ui/atoms/Button";
import { Text } from "@/ui/atoms/Text";

type ArticleErrorFallbackProps = {
  actionLabel?: string;
  className?: string;
  description?: string;
  onGoHome?: () => void;
  title?: string;
};

export function ArticleErrorFallback({
  actionLabel,
  className = "",
  description,
  onGoHome,
  title,
}: ArticleErrorFallbackProps) {
  const router = useRouter();
  const { errorFallback, notifyPuzzleDialogOpen, setArticleModalState } = useAppUi();
  const resolvedActionLabel = actionLabel ?? errorFallback?.actionLabel ?? "Back to home";
  const resolvedDescription =
    description ?? errorFallback?.description ?? "Something went wrong while loading this page.";
  const resolvedTitle = title ?? errorFallback?.title ?? "Page unavailable";

  function goHome() {
    onGoHome?.();
    notifyPuzzleDialogOpen(false);
    setArticleModalState({ expanded: false, open: false, scrollTop: 0 });
    router.replace("/");
  }

  return (
    <section
      className={`flex h-screen w-full items-center justify-center bg-page-background px-6 py-20 text-black ${className}`}
    >
      <div className="flex w-full max-w-130 flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-3">
          <Text as="h1" styleType="body-lg">
            {resolvedTitle}
          </Text>
          <Text as="p" styleType="body-lg" className="text-black/70">
            {resolvedDescription}
          </Text>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            label={resolvedActionLabel}
            iconLeft={<Home className="size-4" aria-hidden="true" />}
            onClick={goHome}
          />
        </div>
      </div>
    </section>
  );
}
