import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";

import type { ArticleCTA, PortableTextValue } from "@/app/types/sanity";
import { resolveButtonHref } from "@/app/utils/resolveButtonHref";

import { sanityImageUrl } from "@/sanity/image";
import { sanityFetch } from "@/sanity/live";

import { articleQuery } from "@/studio/queries/groq";
import type { ArticleQueryResult } from "@/studio/sanity.types";

import type { ButtonAction } from "@/ui/atoms/Button";
import type { SocialLink } from "@/ui/molecules/SocialLinks";

type ArticleData = NonNullable<ArticleQueryResult>;
type ArticleCategory = NonNullable<ArticleData["categories"]>[number];

type ArticleTagSection = {
  key: string;
  heading: string;
  tagGroups: {
    _key: string;
    heading: string;
    tags: string[];
  }[];
};

type ResolvedArticleCTA = {
  label?: string | null;
  href?: string;
  action?: ButtonAction | null;
};

type ArticlePageProps = {
  coverImage?: string;
  title: string | null;
  author: {
    name: string | null;
    avatar?: string | null;
    bio?: PortableTextValue | null;
    socialLinks?: SocialLink[] | null;
  };
  body: PortableTextValue | null;
  excerpt: string | null;
  category?: ArticleCategory | null;
  pixel: ArticleData["pixelPuzzle"];
  tagSections: ArticleTagSection[];
  contentSections: ArticleData["contentSections"];
  gateTitle?: ArticleData["gateTitle"];
  isPrivate: boolean;
  primaryCTA: ResolvedArticleCTA | null;
  secondaryCTA: ResolvedArticleCTA | null;
};

const resolveArticleCTA = (cta?: ArticleCTA | null): ResolvedArticleCTA | null => {
  if (!cta) {
    return null;
  }

  return {
    label: cta.label,
    href: resolveButtonHref(cta),
    action: cta.action,
  };
};

export async function getArticlePageData(slug: string): Promise<ArticlePageProps> {
  const { data: article } = await sanityFetch<ArticleQueryResult>({
    query: articleQuery,
    params: { slug },
    tags: ["sanity:article", `sanity:article:${slug}`],
  });

  if (!article) {
    notFound();
  }

  return {
    coverImage: article.coverImage?.asset?.url ?? undefined,
    title: article.title,
    author: {
      name: article.author?.name ?? null,
      avatar:
        sanityImageUrl(article.author?.avatar, { width: 80, height: 80, quality: 90 }) ??
        article.author?.avatar?.asset?.url ??
        undefined,
      bio: article.author?.bio ?? undefined,
      socialLinks:
        article.author?.socialLinks?.map((link) => ({
          _key: link._key,
          name: stegaClean(link.name),
          url: link.url,
        })) ?? [],
    },
    body: article.body,
    excerpt: article.excerpt,
    category: article.categories?.find((category) => category?.title) ?? null,
    pixel: article.pixelPuzzle,
    isPrivate: article.isPrivate ?? false,
    gateTitle: article.gateTitle,
    tagSections:
      article.tagSections?.map((section, index) => ({
        key: section._id ?? `tag-section-${index}`,
        heading: section.heading ?? "",
        tagGroups: (section.tagGroups ?? []).map((group) => ({
          _key: group._key,
          heading: group.heading ?? "",
          tags: group.tags ?? [],
        })),
      })) ?? [],
    contentSections: article.contentSections,
    primaryCTA: resolveArticleCTA(article.primaryCTA),
    secondaryCTA: resolveArticleCTA(article.secondaryCTA),
  };
}
