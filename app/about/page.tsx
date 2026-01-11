import { getMetadata } from "@/sanity/getMetadata";
import { sanityFetch } from "@/sanity/live";

import { PageWrapper } from "../components/PageWrapper";
import { resolvePixelIconByTitle } from "../utils/iconResolver";

import ArticleAccessGate from "@/app/components/ArticleAccessGate";

export const dynamic = "force-static";

export async function generateMetadata() {
  return getMetadata({ slug: "/about" });
}

export default async function AboutPage() {
  const query = `
      *[_type == "page" && slug.current == "about"][0]{
        heading,
        intro,
        pixelPuzzle->{
          title,
          svg,
          json
        },
      }
    `;

  const { data } = await sanityFetch({ query });
  const closeIcon = await resolvePixelIconByTitle("Close");

  // TODO: fetch bg from Sanity
  return (
    <PageWrapper bgColor="#FFD866">
      <ArticleAccessGate
        title={data?.heading}
        intro={data?.intro}
        pixelPuzzle={data?.pixelPuzzle}
        closeIcon={closeIcon}
        storageKey="about-unlocked"
      />
    </PageWrapper>
  );
}
