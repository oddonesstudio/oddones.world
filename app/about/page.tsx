import { client } from "@/sanityLib/client";
import { getMetadata } from "@/sanityLib/getMetadata";

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
          svg
        },
      }
    `;

  const data = await client.fetch(query);

  return <AboutClient {...data} />;
}
