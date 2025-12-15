import { client } from "@/sanityLib/client";
import { getMetadata } from "@/sanityLib/getMetadata";

import { PageWrapper } from "../components/PageWrapper";
import { resolvePixelIconByTitle } from "../utils/iconResolver";

import AboutClient from "./AboutClient";

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

  const data = await client.fetch(query);
  const closeIcon = await resolvePixelIconByTitle("Close");

  return (
    <PageWrapper bgColor="#FFD866">
      <AboutClient {...data} closeIcon={closeIcon} />
    </PageWrapper>
  );
}
