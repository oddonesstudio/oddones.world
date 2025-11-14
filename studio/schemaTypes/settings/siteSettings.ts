import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "navigation",
      title: "Navigation Links",
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
              name: "page",
              title: "Page Reference",
              type: "reference",
              to: [{ type: "page" }],
            },
            {
              name: "iconType",
              title: "Icon Type",
              type: "string",
              options: {
                list: [
                  { title: "Pixel Icon", value: "pixel" },
                  { title: "Uploaded Icon", value: "image" },
                ],
                layout: "radio",
              },
            },
            {
              name: "pixelIcon",
              title: "Pixel Icon",
              type: "reference",
              to: [{ type: "pixelAsset" }],
              hidden: ({ parent }) => parent?.iconType !== "pixel",
            },
            {
              name: "uploadedIcon",
              title: "Uploaded Icon",
              type: "image",
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.iconType !== "image",
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineField({
          name: "socialLink",
          title: "Social Link",
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Platform Name",
              type: "string",
            },
            {
              name: "url",
              title: "URL",
              type: "url",
            },
            {
              name: "iconType",
              title: "Icon Type",
              type: "string",
              options: {
                list: [
                  { title: "Pixel Icon", value: "pixel" },
                  { title: "Uploaded Icon", value: "image" },
                ],
                layout: "dropdown",
              },
            },
            {
              name: "pixelIcon",
              title: "Pixel Icon",
              type: "reference",
              to: [{ type: "pixelAsset" }],
              hidden: ({ parent }) => parent?.iconType !== "pixel",
            },
            {
              name: "uploadedIcon",
              title: "Uploaded Icon",
              type: "image",
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.iconType !== "image",
            },
          ],
        }),
      ],
    }),
  ],
});
