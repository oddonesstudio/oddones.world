import type { Preview } from "@storybook/nextjs-vite";

import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      exclude: ["className", "onClick", "iconLeft", "iconRight"],
    },
    layout: "centered",
  },
};

export default preview;
