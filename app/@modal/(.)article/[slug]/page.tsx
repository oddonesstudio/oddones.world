import { Suspense } from "react";

import { getArticlePageData } from "@/app/article/getArticlePageData";
import { ArticleLoadingFallback } from "@/app/components/ArticleLoadingFallback";
import { getArticleTextLayoutId } from "@/app/constants/motion";
import { ArticleLayout } from "@/app/layouts/ArticleLayout";
import { getArticleUnlockStorageKey } from "@/app/utils/puzzle";

import { Modal } from "./modal";

export default async function ArticleModal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <Modal slug={slug}>
          <ArticleLoadingFallback className="min-h-full" variant="modal" />
        </Modal>
      }
    >
      <ArticleModalContent slug={slug} />
    </Suspense>
  );
}

async function ArticleModalContent({ slug }: { slug: string }) {
  const article = await getArticlePageData(slug);
  const unlockStorageKey = getArticleUnlockStorageKey({
    pixelTitle: article.pixel?.title,
    slug,
  });

  return (
    <Modal
      slug={slug}
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
        tagSections={article.tagSections ?? []}
        contentSections={article.contentSections ?? []}
        modalPreview
        primaryCTA={article.primaryCTA}
        secondaryCTA={article.secondaryCTA}
      />
    </Modal>
  );
}
