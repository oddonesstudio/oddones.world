import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Header } from ".";

const meta = {
  title: "Components/Header",
  component: Header,
  args: {
    nav: [
      { _key: "0", label: "Blog", linkType: "page", slug: "/", href: "/" },
      {
        _key: "1",
        label: "About",
        linkType: "page",
        slug: "/",
        href: "/",
      },
      { _key: "2", label: "Shop", linkType: "page", slug: null, href: null },
    ],
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};
