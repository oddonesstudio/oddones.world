import { defineField, defineType } from "sanity";

export default defineType({
  name: "button",
  title: "Button",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "linkType",
      title: "Link Type",
      type: "string",
      options: {
        list: [
          { title: "Page", value: "page" },
          { title: "Article", value: "article" },
          { title: "Anchor", value: "anchor" },
          { title: "Contact", value: "contact" },
        ],
        layout: "dropdown",
      },
      description:
        "Optional: link this button to a page, article, or legacy anchor/contact target.",
      hidden: ({ parent }) => parent?.action !== undefined && parent.action !== "internal",
    }),
    defineField({
      name: "action",
      title: "Action",
      type: "string",
      options: {
        list: [
          { title: "Internal", value: "internal" },
          { title: "External", value: "external" },
          { title: "Contact", value: "contact" },
          { title: "Download", value: "download" },
          { title: "Anchor", value: "anchor" },
        ],
        layout: "dropdown",
      },
      initialValue: "internal",
    }),
    defineField({
      name: "pageSlug",
      title: "Page Slug",
      type: "string",
      description: 'Use "/" for the home page, or the page slug without a leading slash.',
      hidden: ({ parent }) => parent?.action !== "internal" || parent?.linkType !== "page",
      validation: (Rule) =>
        Rule.custom((slug, context) => {
          const parent = context.parent as { linkType?: string; action?: string } | undefined;
          return parent?.action === "internal" && parent?.linkType === "page" && !slug
            ? "Page slug is required."
            : true;
        }),
    }),
    defineField({
      name: "externalURL",
      title: "External URL",
      type: "url",
      hidden: ({ parent }) => parent?.action !== "external",
    }),
    defineField({
      name: "articleSlug",
      title: "Article Slug",
      type: "string",
      description: 'Use the article slug without "/article/".',
      hidden: ({ parent }) => parent?.action !== "internal" || parent?.linkType !== "article",
      validation: (Rule) =>
        Rule.custom((slug, context) => {
          const parent = context.parent as { linkType?: string; action?: string } | undefined;
          return parent?.action === "internal" && parent?.linkType === "article" && !slug
            ? "Article slug is required."
            : true;
        }),
    }),
    defineField({
      name: "anchor",
      title: "Anchor",
      type: "string",
      description: "Use a #hash or just the anchor id.",
      hidden: ({ parent }) =>
        parent?.action !== "anchor" &&
        !(parent?.action === "internal" && parent?.linkType === "anchor"),
    }),
    defineField({
      name: "contact",
      title: "Contact Link",
      type: "string",
      description:
        'Use a mailto: link, tel: link, or email address. Defaults to "mailto:soph@oddones.world".',
      hidden: ({ parent }) =>
        parent?.action !== "contact" &&
        !(parent?.action === "internal" && parent?.linkType === "contact"),
    }),
    defineField({
      name: "download",
      title: "Download Link",
      type: "url",
      description: "Link to a file to download.",
      hidden: ({ parent }) => parent?.action !== "download",
    }),
  ],
});
