import { client } from "@/sanityLib/client";

export async function getPixelIconByTitle(title: string) {
  const query = `*[_type == "pixel" && title == $title][0]{svg}`;
  return client.fetch<{ svg?: string }>(query, { title });
}
