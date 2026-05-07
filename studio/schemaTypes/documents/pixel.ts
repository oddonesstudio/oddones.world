import { defineField, defineType } from "sanity";

import { PixelCanvas } from "../../components/PixelCanvas";

export default defineType({
  name: "pixel",
  title: "Pixel Art",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "artwork",
      title: "Artwork",
      description: "Draw pixel art",
      type: "text",
      components: {
        input: PixelCanvas,
      },
    }),
    defineField({
      name: "json",
      title: "JSON",
      description: 'e.g. [["#000",0],[0,"#f00"]]',
      type: "text",
    }),
    defineField({
      name: "svg",
      title: "SVG",
      description: "Upload an SVG",
      type: "image",
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
