import { defineField, defineType } from "sanity";
import richText from "../fields/richText";

export const accordion = defineType({
  name: "accordion",
  title: "Accordion Section",
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
      of: [{ type: "accordionItem" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
});
