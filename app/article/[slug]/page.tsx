import { Suspense } from "react";

import { getArticlePageData } from "@/app/article/getArticlePageData";
import { ArticleLoadingFallback } from "@/app/components/ArticleLoadingFallback";
import { PageWrapper } from "@/app/components/PageWrapper";
import { getArticleTextLayoutId } from "@/app/constants/motion";
import { ArticleLayout } from "@/app/layouts/ArticleLayout";
import { getArticleUnlockStorageKey } from "@/app/utils/puzzle";

import { getMetadata } from "@/sanity/getMetadata";

import { ArticleGateShell } from "./ArticleGateShell";

export const dynamic = "force-dynamic";

type ArticleRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticleRouteProps) {
  const { slug } = await params;

  return getMetadata({ path: `/article/${slug}`, slug });
}

export default async function ArticlePage({ params }: ArticleRouteProps) {
  const { slug } = await params;

  return (
    <PageWrapper slug={slug}>
      <Suspense fallback={<ArticleLoadingFallback />}>
        <ArticleContent slug={slug} />
      </Suspense>
    </PageWrapper>
  );
}

async function ArticleContent({ slug }: { slug: string }) {
  const article = await getArticlePageData(slug);
  const unlockStorageKey = getArticleUnlockStorageKey({
    pixelTitle: article.pixel?.title,
    slug,
  });

  return (
    <ArticleGateShell
      gate={
        article.isPrivate
          ? {
              pixelTitle: article.pixel?.title ?? undefined,
              storageKey: unlockStorageKey,
              title: article.gateTitle ?? undefined,
            }
          : undefined
      }
    >
      <ArticleLayout
        coverImage={article.coverImage}
        textLayoutId={getArticleTextLayoutId(slug)}
        title={article.title}
        author={article.author}
        body={article.body}
        excerpt={article.excerpt}
        category={article.category}
        pixel={article.pixel}
        isPrivate={article.isPrivate}
        unlockStorageKey={unlockStorageKey}
        tagSections={article.tagSections ?? undefined}
        contentSections={article.contentSections ?? undefined}
        primaryCTA={article.primaryCTA}
        secondaryCTA={article.secondaryCTA}
      />
    </ArticleGateShell>
  );
}
