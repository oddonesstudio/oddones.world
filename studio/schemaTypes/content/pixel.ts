import { defineField, defineType } from "sanity";

import { PixelCanvas } from "../../components/PixelCanvas";

export default defineType({
  name: "pixel",
  title: "Pixel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "svg",
      title: "SVG",
      description: "Optional: draw pixel image.",
      type: "text",
      components: {
        input: PixelCanvas,
      },
    }),
    defineField({
      name: "json",
      title: "JSON",
      description: 'e.g. [["#000",0],[0,"#f00"]].',
      type: "text",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title || "Untitled Pixel",
      };
    },
  },
});
