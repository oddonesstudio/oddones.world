import { colorInput } from "@sanity/color-input";
import { visionTool } from "@sanity/vision";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";

import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "oddones",
  projectId: "m6pwmjjo",
  dataset: "production",
  plugins: [structureTool(), visionTool(), colorInput(), media()],
  schema: {
    types: schemaTypes,
  },
  typescript: {
    generateTypes: true,
    outputPath: "./sanity.types.ts",
  },
});
