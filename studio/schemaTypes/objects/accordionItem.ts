import { defineField, defineType } from "sanity";
import richText from "../fields/richText";

export const accordionItem = defineType({
  name: "accordionItem",
  title: "Accordion Item",
  type: "object",
  fields: [
    defineField({
      ...richText,
      name: "title",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
    defineField({
      ...richText,
      name: "content",
      title: "Content",
    }),
  ],
});
