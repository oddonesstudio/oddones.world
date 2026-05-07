import { defineField, defineType } from "sanity";

export default defineType({
  name: "seo",
  title: "SEO Overrides",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Meta Title", type: "string" }),
    defineField({ name: "description", title: "Meta Description", type: "text", rows: 3 }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "canonicalUrl", title: "Canonical URL", type: "url" }),
    defineField({ name: "ogImage", title: "OG Image", type: "image", options: { hotspot: true } }),
  ],
});
