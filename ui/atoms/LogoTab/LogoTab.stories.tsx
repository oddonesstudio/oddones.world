import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LogoTab } from ".";

const meta = {
  title: "Atoms/LogoTab",
  component: LogoTab,
} satisfies Meta<typeof LogoTab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
