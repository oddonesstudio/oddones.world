import type { Preview } from "@storybook/nextjs-vite";

import { AppUiProvider } from "../app/components/AppUiContext";

import "@/app/styles/globals.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <AppUiProvider>
        <Story />
      </AppUiProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      options: { page: { name: "Page", value: "var(--page-background)" } },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      exclude: ["className", "onClick", "iconLeft", "iconRight"],
    },
  },
  initialGlobals: {
    backgrounds: { value: "page" },
  },
  tags: ["autodocs"],
};

export default preview;
