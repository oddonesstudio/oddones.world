import article from "./content/article";
import page from "./content/page";
import pixel from "./content/pixel";

import author from "./fields/author";
import { accordion, accordionItem } from "./fields/accordion";
import button from "./fields/button";
import category from "./fields/category";
import seo from "./fields/seo";
import tagGroup from "./fields/tagGroup";
import tagGroupSection from "./fields/tagGroupSection";

import seoSettings from "./settings/seoSettings";
import siteSettings from "./settings/siteSettings";

export const schemaTypes = [
  page,
  article,
  pixel,
  author,
  accordion,
  accordionItem,
  button,
  category,
  tagGroup,
  tagGroupSection,
  seo,
  seoSettings,
  siteSettings,
];
