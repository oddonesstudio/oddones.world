import { defineField, defineType } from "sanity";

import { PixelEditor } from "../../../app/components/PixelEditor";

export default defineType({
  name: "pixelAsset",
  title: "Pixel Asset",
  type: "document",
  fields: [
    defineField({
      name: "svg",
      title: "Pixel Art",
      type: "text",
      components: {
        input: PixelEditor,
      },
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title || "Pixel Asset",
      };
    },
  },
});
