import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { IconSVG } from "@/ui/_data/media";

import { Icon } from ".";

const meta = {
  title: "Atoms/Icon",
  component: Icon,
  args: {
    svg: IconSVG("close"),
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
