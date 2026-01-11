import { sanityFetch } from "@/sanity/live";

export async function resolvePixelIconByTitle(title: string) {
  const query = `*[_type == "pixel" && title == $title][0]{title, svg}`;
  const { data: icon } = await sanityFetch({ query, params: { title } });

  return icon;
}
