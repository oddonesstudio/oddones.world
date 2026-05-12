import type { MetadataRoute } from "next";

import { sanityFetch } from "@/sanity/live";

type SitemapContentQueryResult = {
  articles: {
    _updatedAt?: string;
    slug?: string | null;
  }[];
  pages: {
    _updatedAt?: string;
    slug?: string | null;
  }[];
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const getSiteUrl = () => {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  if (!rawUrl) {
    return undefined;
  }

  try {
    return trimTrailingSlash(new URL(rawUrl).origin);
  } catch {
    return undefined;
  }
};

const sitemapContentQuery = `{
  "articles": *[_type == "article" && isPrivate != true && defined(slug.current)] | order(publishedAt desc, _updatedAt desc) {
    _updatedAt,
    "slug": slug.current
  },
  "pages": *[_type == "page" && defined(slug.current)] | order(_updatedAt desc) {
    _updatedAt,
    "slug": slug.current
  }
}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  if (!siteUrl) {
    return [];
  }

  const { data } = await sanityFetch<SitemapContentQueryResult>({
    query: sitemapContentQuery,
    stega: false,
    tags: ["sanity:sitemap"],
  });

  const pages =
    data?.pages.map((page) => {
      const path = page.slug === "/" ? "/" : `/${page.slug}`;

      return {
        url: new URL(path, siteUrl).toString(),
        lastModified: page._updatedAt,
      };
    }) ?? [];

  const articles =
    data?.articles.map((article) => ({
      url: new URL(`/article/${article.slug}`, siteUrl).toString(),
      lastModified: article._updatedAt,
    })) ?? [];

  return [...pages, ...articles];
}
