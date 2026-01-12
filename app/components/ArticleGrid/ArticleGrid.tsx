import type { CSSProperties } from "react";

import type { HomePageQueryResult } from "@/studio/sanity.types";

import { ArticleCard } from "../ArticleCard/ArticleCard";

export type ArticleGridArticle = NonNullable<HomePageQueryResult>["articles"][number];

interface ArticleGridProps {
  articles?: ArticleGridArticle[] | null;
}

type AreaName = "one" | "two" | "three" | "four" | "five";

const AREA_TEMPLATE = `
"one one one one two two two"
"one one one one two two two"
"three three four four four five five"
"three three four four four five five"
`;

const AREA_SEQUENCE: AreaName[] = ["one", "two", "three", "four", "five"];

const AREA_VARIANTS: Record<AreaName, "one" | "two" | "three" | "four" | "five"> = {
  one: "one",
  two: "two",
  three: "three",
  four: "four",
  five: "five",
};

export const ArticleGrid = ({ articles }: ArticleGridProps) => {
  return (
    <div className="mx-auto w-full px-20 lg:px-container-lg bg-white py-20 rounded-2xl shadow-lg flex flex-col gap-20">
      <h2 className="text-4xl font-heading mb-6 uppercase text-black">Featured Articles</h2>
      <div
        className="grid gap-4 grid-cols-7 auto-rows-[200px] lg:auto-rows-[240px]"
        style={{ gridTemplateAreas: AREA_TEMPLATE } as CSSProperties}
      >
        {articles?.map((article, idx) => {
          const { _key, ...cardProps } = article;
          const area = AREA_SEQUENCE[idx];
          const variant = (area && AREA_VARIANTS[area]) ?? "default";

          return (
            <ArticleCard
              key={_key ?? cardProps.slug ?? idx}
              variant={variant ?? "default"}
              style={area ? { gridArea: area } : undefined}
              {...article}
            />
          );
        })}
      </div>
    </div>
  );
};
