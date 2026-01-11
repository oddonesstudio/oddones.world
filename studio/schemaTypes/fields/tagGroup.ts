import { defineField, defineType } from "sanity";

export default defineType({
  name: "tagGroup",
  title: "Tag Group",
  type: "object",
  fields: [
    defineField({
      name: "emoji",
      title: "Emoji",
      type: "string",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
});
