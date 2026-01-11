import { defineField, defineType } from "sanity";

export default defineType({
  name: "tagGroupSection",
  title: "Tag Group Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "groups",
      title: "Groups",
      type: "array",
      of: [{ type: "tagGroup" }],
    }),
  ],
});
