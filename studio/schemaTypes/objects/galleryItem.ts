import { defineField, defineType } from "sanity";
import richText from "../fields/richText";

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery Item",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
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
