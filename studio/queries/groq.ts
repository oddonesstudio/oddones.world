import groq from "groq";

export const articleQuery = groq`
    *[_type == "article" && slug.current == $slug][0]{
      title,
      author->{
        name,
        avatar {
          _type,
          crop,
          hotspot,
          asset->{
            _id,
            url
          }
        },
        bio,
        socialLinks
      },
      body,
      primaryCTA->{
        label,
        action,
        linkType,
        anchor,
        externalURL,
        contact,
        download {
          asset->{
            url
          }
        },
        pageSlug,
        articleSlug
      },
      secondaryCTA->{
        label,
        action,
        linkType,
        anchor,
        externalURL,
        contact,
        download {
          asset->{
            url
          }
        },
        pageSlug,
        articleSlug
      },
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
      },
      backgroundPalette,
      "palettes": {
        "dominant": coverImage.asset->metadata.palette.dominant,
        "vibrant": coverImage.asset->metadata.palette.vibrant,
        "muted": coverImage.asset->metadata.palette.muted
      },
      isPrivate,
      gateTitle,
      categories[]->{
        title,
        "slug": slug.current
      },
      pixelPuzzle->{
        title,
        artwork,
        json,
        "svg": svg.asset->url,
      },
      excerpt,
      tagSections[]->{
        _id,
        heading,
        tagGroups[]{
          _key,
          heading,
          tags
        }
      },
      contentSections[]->{
        _id,
        _type,
        _type == "accordion" => {
          heading,
          summaryText,
          items[]{
            _key,
            title,
            image {
              asset->{
                url
              }
            },
            content
          }
        },
         _type == "gallery" => {
          heading,
          summaryText,
          items[]{
            _key,
            title,
            image {
              asset->{
                url
              }
            },
            content
          }
        },
      }
    }
  `;

export const homePageQuery = groq`*[_type == "page" && slug.current == "/"][0]{
  heading,
  intro,
  primaryCTA->{
    label,
    action,
    linkType,
    anchor,
    externalURL,
    contact,
    download {
      asset->{
        url
      }
    },
    pageSlug,
    articleSlug
  },
  secondaryCTA->{
    label,
    action,
    linkType,
    anchor,
    externalURL,
    contact,
    download {
      asset->{
        url
      }
    },
    pageSlug,
    articleSlug
  },
  "themeColor": {
    "h": coalesce(themeColor.hsl.h, 200),
    "s": coalesce(themeColor.hsl.s * 100, 100),
    "l": coalesce(themeColor.hsl.l * 100, 50)
  },
  pixelPuzzle->{
    title,
    artwork,
    "svg": svg.asset->url,
    json
  },
  "featuredArticle": coalesce(featuredArticle->{
    "slug": slug.current,
    title,
    excerpt,
    body,
    isPrivate,
    author->{
      name,
      avatar { _type, crop, hotspot, asset->{ _id, url } },
      bio
    },
    categories[]->{
      title,
      "slug": slug.current
    },
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
    },
    backgroundPalette,
    "palettes": {
      "dominant": coverImage.asset->metadata.palette.dominant,
      "vibrant": coverImage.asset->metadata.palette.vibrant,
      "muted": coverImage.asset->metadata.palette.muted
    },
    pixelPuzzle->{
      title,
      artwork,
      json,
      "svg": svg.asset->url
    },
  }, *[_type == "article" && "featured" in categories[]->slug.current] | order(publishedAt desc, _updatedAt desc)[0]{
    "slug": slug.current,
    title,
    excerpt,
    body,
    isPrivate,
    author->{
      name,
      avatar { _type, crop, hotspot, asset->{ _id, url } },
      bio
    },
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
    },
    backgroundPalette,
    "palettes": {
      "dominant": coverImage.asset->metadata.palette.dominant,
      "vibrant": coverImage.asset->metadata.palette.vibrant,
      "muted": coverImage.asset->metadata.palette.muted
    },
    pixelPuzzle->{
      title,
      artwork,
      json,
      "svg": svg.asset->url
    },
  }),
  "articles": *[_type == "article" && "featured" in categories[]->slug.current] | order(publishedAt desc, _updatedAt desc) {
    _key,
    "slug": slug.current,
    title,
    excerpt,
    author->{
      name,
      "avatar": avatar.asset->url,
      bio
    },
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

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
      navigation[] {
        _key,
        label,
        linkType,
        "slug": select(
          linkType == "page" => page->slug.current,
          linkType == "article" => "article/" + article->slug.current,
          null
        ),
        "href": select(
          linkType == "page" => page->slug.current,
          linkType == "article" => "/article/" + article->slug.current,
          null
        )
      },
      headerCTA->{
        label,
        action,
        linkType,
        anchor,
        externalURL,
        contact,
        download {
          asset->{
            url
          }
        },
        "slug": select(
          linkType == "page" => pageSlug,
          linkType == "article" => "article/" + articleSlug,
          null
        ),
        "href": select(
          linkType == "page" => pageSlug,
          linkType == "article" => "/article/" + articleSlug,
          null
        ),
        pageSlug,
        articleSlug
      },
      errorFallback {
        title,
        description,
        actionLabel
      },
      copyright,
      socialLinks[] {
        name,
        url
      }
    }`;
