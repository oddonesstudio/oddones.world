import { sanityFetch } from "@/sanity/live";

export async function getPixelIconByTitle(title: string) {
  const query = `*[_type == "pixel" && title == $title][0]{svg}`;
  const { data } = await sanityFetch({ query, params: { title } });
  return data as { svg?: string };
}
