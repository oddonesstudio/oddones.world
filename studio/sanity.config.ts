import { colorInput } from "@sanity/color-input";
import { visionTool } from "@sanity/vision";

import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";

import { schemaTypes } from "./schemaTypes";
import { defaultDocumentNode } from "./structure/defaultDocumentNode";

const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000";
const previewOrigin = new URL(previewUrl).origin;

export default defineConfig({
  name: "default",
  title: "oddones",
  projectId: "m6pwmjjo",
  dataset: "production",
  plugins: [
    structureTool({ defaultDocumentNode }),
    presentationTool({
      allowOrigins: [previewOrigin],
      previewUrl: {
        initial: previewUrl,
        previewMode: {
          enable: "/api/draft",
          disable: "/api/disable-draft",
        },
      },
    }),
    visionTool(),
    colorInput(),
    media(),
  ],
  schema: {
    types: schemaTypes,
  },
});
