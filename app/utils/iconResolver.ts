import { client } from "@/sanityLib/client";

export async function resolvePixelIconByTitle(title: string) {
  const query = `*[_type == "pixel" && title == $title][0]{title, svg}`;
  const icon = await client.fetch(query, { title });

  return icon;
}
