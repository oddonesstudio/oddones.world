/**
 * Derived types from GROQ query results
 * These types represent only the fields that are actually queried,
 * not the full Sanity schema types
 */

import type {
  ArticleQueryResult,
  HomePageQueryResult,
  SiteSettingsQueryResult,
} from "../../studio/sanity.types";

type ArticleQueryData = NonNullable<ArticleQueryResult>;
type HomePageQueryData = NonNullable<HomePageQueryResult>;
type SiteSettingsData = NonNullable<SiteSettingsQueryResult>;

// Extract the pixel puzzle type (same shape in both article and homepage queries)
export type PixelPuzzle = Exclude<ArticleQueryData["pixelPuzzle"], null>;

// Extract the article preview from the homepage articles array
export type ArticlePreview = NonNullable<HomePageQueryData["articles"]>[number];

export type FeaturedArticle = Exclude<HomePageQueryData["featuredArticle"], null>;

// Extract the author type from article query
export type Author = Exclude<ArticleQueryData["author"], null>;

// Extract navigation and social link types from site settings
export type NavigationLink = Exclude<
  Exclude<SiteSettingsData["navigation"], null | undefined>[number],
  undefined
>;

export type SocialLink = Exclude<
  Exclude<SiteSettingsData["socialLinks"], null | undefined>[number],
  undefined
>;

export type Accordion = Extract<
  NonNullable<ArticleQueryData["contentSections"]>[number],
  { _type: "accordion" }
>;

export type ArticleContentSection = NonNullable<ArticleQueryData["contentSections"]>[number];
export type AccordionItem = NonNullable<Accordion["items"]>[number];
export type ArticlePortableText = NonNullable<ArticleQueryData["body"]>;
export type AccordionPortableText = NonNullable<AccordionItem["content"]>;
export type PortableTextValue = ArticlePortableText | AccordionPortableText;
export type ArticleCTA = Exclude<ArticleQueryData["primaryCTA"], null>;
export type HeaderCTA = Exclude<SiteSettingsData["headerCTA"], null>;
export type Navigation = Exclude<SiteSettingsData["navigation"], null>;

// Full result types for pages
export type ArticlePageData = ArticleQueryResult;
export type HomePageData = HomePageQueryResult;
export type SiteSettings = SiteSettingsQueryResult;
