import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "m6pwmjjo",
    dataset: "production",
  },
  typegen: {
    path: "./queries/**/*.{ts,tsx,js,jsx}",
    schema: "./schema.json",
    generates: "./sanity.types.ts",
  },
});
