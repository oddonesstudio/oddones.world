import groq from "groq";

export const homePageQuery = groq`*[_type == "page" && slug.current == "/"][0]{
  heading,
  intro,
  "themeColor": {
    "h": coalesce(themeColor.hsl.h, 200),
    "s": coalesce(themeColor.hsl.s * 100, 100),
    "l": coalesce(themeColor.hsl.l * 100, 50)
  },
  pixelPuzzle->{
    title,
    svg,
    json
  },
  "articles": *[_type == "article" && "featured" in categories[]->slug.current] {
    _key,
    "slug": slug.current,
    title,
    excerpt,
    coverImage {
      asset->{
        url,
        metadata {
          palette {
            dominant { background, foreground, population },
            vibrant { background, foreground },
            muted { background, foreground }
          },
          blurHash
        }
      }
    }
  }
}
`;
