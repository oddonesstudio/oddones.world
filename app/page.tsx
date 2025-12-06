import { client } from "@/sanityLib/client";
import { urlFor } from "@/sanityLib/image";

import type { Article } from "@/studio/sanity.types";

import { ArticleGrid } from "./components/ArticleGrid/ArticleGrid";
import { Container } from "./components/Container/Container";
import { SectionHeader } from "./components/SectionHeader";

import { homePageQuery } from "./queries/homePage";

import { resolvePixelIconByTitle } from "./utils/iconResolver";
// import { getContrastingColor } from "./utils/getContrastingColor";
// import { Video } from "./components/Video";

export default async function Home() {
  const data = await client.fetch(homePageQuery);
  const closeIcon = await resolvePixelIconByTitle("Close");
  const playIcon = await resolvePixelIconByTitle("Play");

  const articles =
    data.articles?.map((article: Article) => ({
      ...article,
      image: article?.coverImage ? urlFor(article.coverImage).width(1200).url() : undefined,
    })) ?? [];

  // const { h, s, l } = data.themeColor;
  // const bg = `hsl(${h}, ${s}%, ${l}%)`;
  // const fg = getContrastingColor(data.themeColor);

  return (
    <div className="mt-[calc(var(--header-height)*-1)] pt-(--header-height) pb-[537px]">
      <Container>
        <div className="flex flex-col gap-20">
          <SectionHeader {...data} closeIcon={closeIcon} playIcon={playIcon} />
          {/* <Video className="aspect-video w-full" playIcon={playIcon} /> */}
          <ArticleGrid articles={articles} />
        </div>
      </Container>
    </div>
  );
}
