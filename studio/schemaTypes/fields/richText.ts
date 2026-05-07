import { defineField } from "sanity";

export default defineField({
  name: "body",
  title: "Body",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Meow", value: "meow" },
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Tag", value: "tag" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
      },
    },
    { type: "image" },
  ],
});
