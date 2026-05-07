"use client";

import { useEffect } from "react";

import { ArticleErrorFallback } from "@/app/components/ArticleErrorFallback";

type ArticlePageErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ArticlePageError({ error }: ArticlePageErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ArticleErrorFallback />;
}
