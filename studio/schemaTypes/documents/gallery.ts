import { defineField, defineType } from "sanity";
import richText from "../fields/richText";

export const gallery = defineType({
  name: "gallery",
  title: "Gallery Section",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      ...richText,
      name: "summaryText",
      title: "Summary Text",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "galleryItem" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
});
