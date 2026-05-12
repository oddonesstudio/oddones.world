import { defineField, defineType, defineArrayMember } from "sanity";
import richText from "../fields/richText";

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
      name: "gateTitle",
      title: "Gate Title",
      type: "string",
      description: "Title to display on the access gate for this article",
    }),
    defineField({
      name: "primaryCTA",
      title: "Primary CTA",
      type: "reference",
      to: [{ type: "button" }],
    }),
    defineField({
      name: "secondaryCTA",
      title: "Secondary CTA",
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
      ...richText,
      name: "body",
      title: "Body",
    }),
    defineField({
      name: "pixelPuzzle",
      title: "Pixel Puzzle",
      type: "reference",
      to: [{ type: "pixel" }],
      options: { disableNew: false },
    }),
    defineField({
      name: "tagSections",
      title: "Tag Sections",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tagSections" }] }],
    }),
    defineField({
      name: "contentSections",
      title: "Content Sections",
      type: "array",
      of: [
        defineArrayMember({
          name: "section",
          type: "reference",
          to: [{ type: "accordion" }, { type: "gallery" }],
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
});
