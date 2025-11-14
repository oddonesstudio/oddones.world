import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "pageTitle" },
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro Text",
      type: "text",
      rows: 3,
    }),
    {
      name: "pixelPuzzle",
      title: "Pixel Puzzle",
      type: "reference",
      to: [{ type: "pixelAsset" }],
      options: {
        disableNew: false,
      },
    },
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
});
