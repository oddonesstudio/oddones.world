"use client";

import { cn } from "@/app/utils/cn";

import { ArticleGrid, type ArticleGridArticle } from "./ArticleGrid/ArticleGrid";
import { HomeHero } from "./Hero/HomeHero";

interface HomeHeroStackProps {
  heading: string | null;
  intro: string | null;
  articles: ArticleGridArticle[];
  overlap?: number;
  stickyOffset?: number;
  className?: string;
}

export const HomeHeroStack = ({ heading, intro, articles, className }: HomeHeroStackProps) => {
  return (
    <div className={cn("relative flex flex-col gap-16 pb-24", className)}>
      <section className="sticky top-6">
        <HomeHero heading={heading} intro={intro} />
      </section>
      <section className="z-10">
        <ArticleGrid articles={articles} />
      </section>
    </div>
  );
};
