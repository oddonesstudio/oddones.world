import { defineField } from "sanity";

export default defineField({
  name: "socialLink",
  title: "Social Link",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Platform Name",
      type: "string",
      options: {
        list: [
          { title: "LinkedIn", value: "linkedin" },
          { title: "Github", value: "github" },
          { title: "Email", description: "e.g. mailto:", value: "email" },
        ],
        layout: "dropdown",
      },
    },
    {
      name: "url",
      title: "URL",
      type: "url",
    },
  ],
});
