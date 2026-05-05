import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Circle } from "lucide-react";
import { fn } from "storybook/test";

import { Button } from ".";

const meta = {
  title: "Atoms/Button",
  component: Button,
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

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
    iconLeft: <Circle size={18} />,
  },
};

export const IconRight: Story = {
  args: {
    ...Default.args,
    iconRight: <Circle size={18} />,
  },
};

export const External: Story = {
  args: {
    ...Default.args,
    action: "external",
  },
};
