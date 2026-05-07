import { defineField, defineType } from "sanity";

export default defineType({
  name: "tagSections",
  title: "Tag Sections",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "tagGroups",
      title: "Tag Groups",
      type: "array",
      of: [{ type: "tagGroups" }],
    }),
  ],
});
