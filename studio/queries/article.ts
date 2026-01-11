import groq from "groq";

export const articleQuery = groq`
    *[_type == "article" && slug.current == $slug][0]{
      title,
      author->{
        name,
        avatar {
          asset->{
            url
          }
        },
        bio,
      },
      body,
      primaryCta->{
        label,  
        type,
      },
      coverImage {
        asset->{
          url,
          metadata {
            palette {
              dominant {
                background,
                foreground,
                population,
              },
              vibrant {
                background,
                foreground
              },
              muted {
                background,
                foreground
              }
            },
            blurHash
          }
        }
      },
      backgroundPalette,
      "palettes": {
        "dominant": coverImage.asset->metadata.palette.dominant,
        "vibrant": coverImage.asset->metadata.palette.vibrant,
        "muted": coverImage.asset->metadata.palette.muted
      },
      isPrivate,
      puzzle->{
        title,
        svg,
        json
      },
      excerpt,
      "pixel": icon->svg,
      tagGroupSections[]{
        heading,
        groups[]{
          emoji,
          tags
        }
      }
    }
  `;
