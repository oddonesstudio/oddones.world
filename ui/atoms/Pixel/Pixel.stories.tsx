import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ImageSVG } from "@/ui/_data/media";

import { Pixel } from ".";

const meta = {
  title: "Atoms/Pixel",
  component: Pixel,
  args: {
    svg: ImageSVG(),
  },
} satisfies Meta<typeof Pixel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
