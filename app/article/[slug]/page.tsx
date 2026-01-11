import { notFound } from "next/navigation";

import ArticleAccessGate from "@/app/components/ArticleAccessGate";
import { Article } from "@/app/layouts/Article/Article";
import { resolvePixelIconByTitle } from "@/app/utils/iconResolver";

import { getMetadata } from "@/sanity/getMetadata";
import { urlFor } from "@/sanity/image";
import { sanityFetch } from "@/sanity/live";

import { articleQuery } from "@/studio/queries/article";
import type { ArticleQueryResult, Article as ArticleType } from "@/studio/sanity.types";
import { PageWrapper } from "@/app/components/PageWrapper";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return getMetadata({ slug });
}

export type BackgroundColor = NonNullable<ArticleType["backgroundColor"]>;
export type BackgroundColorMap = Record<BackgroundColor, string | undefined>;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: page } = await sanityFetch<ArticleQueryResult>({
    query: articleQuery,
    params: { slug },
  });

  if (!page) return notFound();

  const closeIcon = page.isPrivate ? await resolvePixelIconByTitle("Close") : undefined;
  const featuredImage = page.coverImage ? urlFor(page.coverImage).width(2000).url() : "";
  const avatar = page.author?.avatar ? urlFor(page.author.avatar).width(2000).url() : "";

  // Only apply custom theme if coverImage exists AND backgroundPalette is selected
  let bgHSL: { h: number; s: number; l: number } | null = null;

  if (page.coverImage && page.backgroundPalette) {
    // Get the selected palette based on backgroundPalette
    const selectedPaletteName = page.backgroundPalette;
    const selectedPalette =
      page.palettes?.[selectedPaletteName as "dominant" | "vibrant" | "muted"];

    // Parse hex to RGB then to HSL
    function hexToHSL(hex: string): { h: number; s: number; l: number } | null {
      if (!hex) return null;
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0,
        s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            break;
          case g:
            h = ((b - r) / d + 2) / 6;
            break;
          case b:
            h = ((r - g) / d + 4) / 6;
            break;
        }
      }
      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    bgHSL = selectedPalette?.background ? hexToHSL(selectedPalette.background) : null;
  }

  return (
    <PageWrapper
      scopedTheme={page.coverImage ? (bgHSL ?? undefined) : undefined}
      useStoredTheme={!page.coverImage}
    >
      <Article
        featuredImage={featuredImage}
        title={page.title}
        author={{
          name: page.author?.name || null,
          avatar: avatar || null,
          bio: page.author?.bio || null,
        }}
        body={page.body}
        excerpt={page.excerpt}
        pixel={page.pixel}
        accessOverlay={
          page.isPrivate ? (
            <ArticleAccessGate
              key={slug}
              intro={page.excerpt}
              pixelPuzzle={page.puzzle as any}
              // closeIcon={closeIcon}
              storageKey={`article-unlocked:${slug}`}
            />
          ) : null
        }
        // tags={page.tagGroupSections?.map((section: any) => ({
        //   heading: section.heading,
        //   groups: section.groups?.map((group: any) => ({
        //     emoji: group.emoji,
        //     tags: group.tags,
        //   })),
        // }))}
      />
    </PageWrapper>
  );
}
