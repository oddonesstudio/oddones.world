import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { resolveButtonHref } from "@/app/utils/resolveButtonHref";

import { sanityFetch } from "@/sanity/live";

import { homePageQuery } from "@/studio/queries/groq";
import type { HomePageQueryResult } from "@/studio/sanity.types";

import { FeaturedArticlePortal } from "@/ui/components/FeaturedArticlePortal";
import { Hero } from "@/ui/content-sections/Hero";

export default async function Home() {
  const { data: page } = await sanityFetch<HomePageQueryResult>({
    query: homePageQuery,
    tags: ["sanity:home"],
  });

  if (!page) {
    return notFound();
  }

  const pageStyle: (CSSProperties & { "--page-background"?: string }) | undefined = page.themeColor
    ? {
        "--page-background": `hsl(${page.themeColor.h} ${page.themeColor.s}% ${page.themeColor.l}%)`,
      }
    : undefined;

  return (
    <div className="bg-page-background pt-(--header-height) pb-(--footer-height)" style={pageStyle}>
      <Hero
        heading={page.heading}
        intro={page.intro}
        primaryCTA={
          page.primaryCTA
            ? {
                label: page.primaryCTA.label,
                href: resolveButtonHref(page.primaryCTA),
                action: page.primaryCTA.action,
              }
            : null
        }
        secondaryCTA={
          page.secondaryCTA
            ? {
                label: page.secondaryCTA.label,
                href: resolveButtonHref(page.secondaryCTA),
                action: page.secondaryCTA.action,
              }
            : null
        }
        pixel={page.pixelPuzzle}
        featuredArticle={page.featuredArticle}
      />
      {page.featuredArticle && <FeaturedArticlePortal article={page.featuredArticle} />}
    </div>
  );
}
