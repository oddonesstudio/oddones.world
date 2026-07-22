import type { Metadata } from "next";

import { sanityFetch } from "./live";

interface MetadataProps {
  contentType?: "page" | "article";
  path?: string;
  slug?: string;
}

type MetadataQueryResult = {
  content?: {
    _type?: string;
    isPrivate?: boolean;
    title?: string;
    excerpt?: string;
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
      ogImage?: string;
      canonicalUrl?: string;
    };
    coverImage?: string;
  } | null;
  global?: {
    defaultTitle?: string;
    defaultDescription?: string;
    defaultKeywords?: string[];
    ogImage?: string;
    defaultCanonicalUrl?: string;
  } | null;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const normalizePath = (path?: string) => {
  if (!path || path === "/") {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
};

const getSiteUrl = (defaultCanonicalUrl?: string) => {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    defaultCanonicalUrl;

  if (!rawUrl) {
    return undefined;
  }

  try {
    const url = new URL(rawUrl);
    return trimTrailingSlash(url.origin);
  } catch {
    return undefined;
  }
};

const resolveAbsoluteUrl = (urlOrPath: string, siteUrl?: string) => {
  try {
    return new URL(urlOrPath).toString();
  } catch {
    if (!siteUrl) {
      return urlOrPath;
    }

    return new URL(urlOrPath, siteUrl).toString();
  }
};

export async function getMetadata({
  contentType,
  path,
  slug,
}: MetadataProps = {}): Promise<Metadata> {
  const contentTypeFilter = contentType ? "_type == $contentType" : '_type in ["page", "article"]';
  const contentQuery = slug
    ? `*[${contentTypeFilter} && slug.current == $slug][0]{
        _type,
        isPrivate,
        title,
        excerpt,
        seo {
          title,
          description,
          keywords,
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
      defaultKeywords,
      "ogImage": defaultOgImage.asset->url,
      defaultCanonicalUrl
    }
  }`;

  const { data } = await sanityFetch({
    query,
    params: { contentType: contentType ?? null, slug },
    stega: false,
    tags: slug ? ["sanity:seo", `sanity:metadata:${slug}`] : ["sanity:seo"],
  });
  const { content, global } = data as MetadataQueryResult;

  // Priorities:
  // 1. Content-level SEO
  // 2. Content title/excerpt/coverImage
  // 3. Global defaults
  const title = content?.seo?.title || content?.title || global?.defaultTitle;
  const description = content?.seo?.description || content?.excerpt || global?.defaultDescription;
  const ogImage =
    content?.seo?.ogImage || content?.coverImage || global?.ogImage || "/og-default.jpg";
  const keywords = content?.seo?.keywords?.length ? content.seo.keywords : global?.defaultKeywords;
  const siteUrl = getSiteUrl(global?.defaultCanonicalUrl);
  const routePath = normalizePath(path ?? (slug === "/" ? "/" : slug));
  const canonical =
    content?.seo?.canonicalUrl ||
    (siteUrl && path !== undefined ? resolveAbsoluteUrl(routePath, siteUrl) : undefined);
  const resolvedOgImage = resolveAbsoluteUrl(ogImage, siteUrl);
  const isPrivate = content?._type === "article" && content.isPrivate === true;

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: resolvedOgImage ? [{ url: resolvedOgImage, width: 1200, height: 630 }] : [],
      url: canonical,
      siteName: "Odd Ones",
      locale: "en_GB",
      type: content?._type === "article" ? "article" : "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: resolvedOgImage ? [resolvedOgImage] : [],
    },
    alternates: { canonical },
    robots: isPrivate
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            noarchive: true,
          },
        }
      : {
          index: true,
          follow: true,
        },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}
