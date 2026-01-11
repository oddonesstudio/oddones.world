import { sanityFetch } from "./live";

interface MetadataProps {
  slug?: string;
}

export async function getMetadata({ slug }: MetadataProps = {}) {
  const contentQuery = slug
    ? `*[_type in ["page", "article"] && slug.current == $slug][0]{
        _type,
        title,
        seo {
          title,
          description,
          "ogImage": ogImage.asset->url,
          canonicalUrl
        },
        "coverImage": select(
          defined(seo.ogImage) => null,
          defined(coverImage.asset) => coverImage.asset->url,
          null
        )
      }`
    : "null";

  const query = `{
    "content": ${contentQuery},
    "global": *[_id == "seoSettings"][0]{
      defaultTitle,
      defaultDescription,
      "ogImage": defaultOgImage.asset->url,
      defaultCanonicalUrl
    }
  }`;

  const { data } = await sanityFetch({ query, params: { slug }, stega: false });
  const { content, global } = data as {
    content?: Record<string, any> | null;
    global?: Record<string, any> | null;
  };

  // Priorities:
  // 1. Content-level SEO
  // 2. Content title/coverImage
  // 3. Global defaults
  const title = content?.seo?.title || content?.title || global?.defaultTitle;
  const description = content?.seo?.description || global?.defaultDescription;
  const ogImage =
    content?.seo?.ogImage || content?.coverImage || global?.ogImage || "/og-default.jpg";
  const canonical = content?.seo?.canonicalUrl || global?.defaultCanonicalUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
      url: canonical,
      siteName: "Odd Ones",
      locale: "en_GB",
      type: content?._type === "article" ? "article" : "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    alternates: { canonical },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}
