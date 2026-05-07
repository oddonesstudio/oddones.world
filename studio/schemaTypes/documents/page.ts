import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "heading" },
    }),
    defineField({
      name: "themeColor",
      title: "Theme Color",
      type: "color",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro Text",
      type: "text",
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
      name: "pixelPuzzle",
      title: "Pixel Puzzle",
      type: "reference",
      to: [{ type: "pixel" }],
      options: { disableNew: false },
    }),
    defineField({
      name: "featuredArticle",
      title: "Featured Article",
      type: "reference",
      to: [{ type: "article" }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],

  preview: {
    select: {
      slug: "slug.current",
    },
    prepare({ slug }) {
      return {
        title:
          (slug === "/" ? "Home" : slug.charAt(0).toUpperCase() + slug.slice(1)) || "Untitled Page",
        subtitle: slug ? `${slug === "/" ? slug : `/${slug}`}` : "",
      };
    },
  },
});
