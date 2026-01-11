import { defineField, defineType } from "sanity";

export default defineType({
  name: "button",
  title: "Button",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "action",
      title: "Action",
      type: "string",
      options: {
        list: [
          { title: "Internal", value: "internal" },
          { title: "External", value: "external" },
          { title: "Download", value: "download" },
        ],
        layout: "dropdown",
      },
      initialValue: "internal",
    }),
  ],
});
