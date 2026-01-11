import { defineField, defineType } from "sanity";

export const accordionItem = defineType({
  name: "accordionItem",
  title: "Accordion Item",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
  ],
});

export const accordion = defineType({
  name: "accordion",
  title: "Accordion",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "accordionItem" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
});
