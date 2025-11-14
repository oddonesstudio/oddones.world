import article from "./content/article";
import page from "./content/page";
import pixelAsset from "./content/pixelAsset";

import author from "./fields/author";
import category from "./fields/category";
import seo from "./fields/seo";

import seoSettings from "./settings/seoSettings";
import siteSettings from "./settings/siteSettings";

export const schemaTypes = [
  page,
  seoSettings,
  siteSettings,
  article,
  author,
  category,
  pixelAsset,
  seo,
];
