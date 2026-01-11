import { notFound } from "next/navigation";

import { urlFor } from "@/sanity/image";
import { sanityFetch } from "@/sanity/live";

import { homePageQuery } from "@/studio/queries/homePage";
import type { HomePageQueryResult } from "@/studio/sanity.types";

import { HomeHeroStack } from "./components/HomeHeroStack";
import { PageWrapper } from "./components/PageWrapper";
import ThemePicker from "./components/ThemePicker";

export default async function Home() {
  const { data: page } = await sanityFetch<HomePageQueryResult>({ query: homePageQuery });

  if (!page) {
    return notFound();
  }

  const articles =
    page.articles?.map((article) => ({
      ...article,
      image: article?.coverImage ? urlFor(article.coverImage).width(1200).url() : undefined,
    })) ?? [];

  console.log("Home page articles:", page.articles);

  return (
    <PageWrapper>
      <HomeHeroStack heading={page.heading} intro={page.intro} articles={articles} overlap={120} />
      <ThemePicker defaultTheme={page.themeColor} />
    </PageWrapper>
  );
}
