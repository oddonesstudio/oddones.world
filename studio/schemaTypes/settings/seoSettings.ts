import { defineField, defineType } from "sanity";

export default defineType({
  name: "seoSettings",
  title: "SEO Settings",
  type: "document",
  fields: [
    defineField({
      name: "defaultTitle",
      title: "Default Title",
      type: "string",
    }),
    defineField({
      name: "defaultDescription",
      title: "Default Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default OG Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "defaultKeywords",
      title: "Default Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "defaultCanonicalUrl",
      title: "Default Canonical URL",
      type: "url",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Global SEO Settings" };
    },
  },
});
