import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Article",
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
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "isPrivate",
      title: "Private",
      type: "boolean",
      initialValue: false,
      description: "Require a password to view this article",
    }),
    defineField({
      name: "primaryCTA",
      title: "Primary CTA",
      type: "reference",
      to: [{ type: "button" }],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "backgroundPalette",
      title: "Background Palette",
      type: "string",
      options: {
        list: [
          { title: "Dominant", value: "dominant" },
          { title: "Vibrant", value: "vibrant" },
          { title: "Muted", value: "muted" },
        ],
        layout: "dropdown",
      },
      initialValue: "vibrant",
      description: "Choose which palette colour to use as the background for this article",
      hidden: ({ document }: any) => !document?.coverImage,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }, { type: "image" }, { type: "accordion" }],
    }),
    defineField({
      name: "puzzle",
      title: "Puzzle",
      type: "reference",
      to: [{ type: "pixel" }],
      options: { disableNew: false },
    }),
    defineField({
      name: "tagGroupSections",
      title: "Tag Group Sections",
      type: "array",
      of: [{ type: "tagGroupSection" }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
});
