import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { Button } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const svg = `<svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Circle</title>
    <circle cx="10" cy="10" r="10" fill="currentColor" />
  </svg>`;

const Default = {
  args: {
    label: "Button",
  },
};

export const Primary: Story = {
  args: Default.args,
};

export const Secondary: Story = {
  args: {
    ...Default.args,
    variant: "secondary",
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: "lg",
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    size: "sm",
  },
};

export const IconLeft: Story = {
  args: {
    ...Default.args,
    iconLeft: { svg },
  },
};

export const IconRight: Story = {
  args: {
    ...Default.args,
    iconRight: { svg },
  },
};
