export const homePageQuery = `*[_type == "page" && slug.current == "/"][0]{
  heading,
  intro,
  "themeColor": {
    "h": themeColor.hsl.h,
    "s": themeColor.hsl.s * 100,
    "l": themeColor.hsl.l * 100
  },
  pixelPuzzle->{
    title,
    svg,
    json
  },
  articles[]{
    _key,
    ...@->{
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
}
`;
