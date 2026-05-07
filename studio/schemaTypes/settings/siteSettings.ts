import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    {
      name: "header",
      title: "Header",
    },
    {
      name: "errors",
      title: "Errors",
    },
    {
      name: "footer",
      title: "Footer",
    },
  ],
  fields: [
    defineField({
      name: "navigation",
      title: "Navigation Links",
      description: "Links to display in the site header and footer.",
      type: "array",
      of: [
        defineField({
          name: "navLink",
          title: "Navigation Link",
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
            },
            {
              name: "linkType",
              title: "Link Type",
              type: "string",
              options: {
                list: [
                  { title: "Page", value: "page" },
                  { title: "Article", value: "article" },
                ],
                layout: "radio",
                default: "page",
              },
            },
            {
              name: "page",
              title: "Page Reference",
              type: "reference",
              to: [{ type: "page" }],
              hidden: ({ parent }) => parent?.linkType !== "page",
            },
            {
              name: "article",
              title: "Article Reference",
              type: "reference",
              to: [{ type: "article" }],
              hidden: ({ parent }) => parent?.linkType !== "article",
            },
          ],
        }),
      ],
    }),
    defineField({
      group: "header",
      name: "headerCTA",
      title: "Header Call to Action",
      type: "reference",
      to: [{ type: "button" }],
    }),
    defineField({
      group: "errors",
      name: "errorFallback",
      title: "Error Fallback",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "actionLabel",
          title: "Action Label",
          type: "string",
        }),
      ],
    }),
    defineField({
      group: "footer",
      name: "copyright",
      title: "Copyright",
      description: 'Current year added programmatically. E.g. "© Odd Since 2026".',
      type: "string",
    }),
    defineField({
      group: "footer",
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "socialLink",
        },
      ],
    }),
  ],
});
