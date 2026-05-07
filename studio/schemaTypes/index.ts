import { accordion } from "./documents/accordion";
import article from "./documents/article";
import author from "./documents/author";
import button from "./documents/button";
import category from "./documents/category";
import page from "./documents/page";
import pixel from "./documents/pixel";
import socialLink from "./documents/socialLink";
import tagSections from "./documents/tagSections";
import richText from "./fields/richText";

import { accordionItem } from "./objects/accordionItem";
import seo from "./objects/seo";
import tagGroups from "./objects/tagGroups";

import seoSettings from "./settings/seoSettings";
import siteSettings from "./settings/siteSettings";

export const schemaTypes = [
  accordion,
  accordionItem,
  article,
  author,
  button,
  category,
  page,
  pixel,
  richText,
  seo,
  seoSettings,
  siteSettings,
  socialLink,
  tagGroups,
  tagSections,
];
