import type { JSX } from "react";

import { cn, tv } from "@/ui/_lib/utils";

const styles = tv({
  slots: {
    base: "",
  },
  variants: {
    type: {
      "display-xl": "text-display-xl",
      "heading-xl": "text-heading-xl",
      "heading-lg": "text-heading-lg",
      "heading-md": "text-heading-md",
      "body-lg": "text-body-lg",
      "body-md": "text-body-md",
      "body-sm": "text-body-sm",
      "label-md": "text-label-md",
      "label-sm": "text-label-sm",
    },
  },
});

interface TextProps {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
  id?: string;
  styleType: (typeof styleTypes)[number];
}

export const Text = (props: TextProps) => {
  const { as: Component = "div", children, styleType, className, id } = props;
  const { base } = styles({ type: styleType });

  return (
    <Component id={id} className={cn(base(), className)}>
      {children}
    </Component>
  );
};

const styleTypes = [
  "display-xl",
  "heading-xl",
  "heading-lg",
  "heading-md",
  "body-lg",
  "body-md",
  "body-sm",
  "label-md",
  "label-sm",
] as const;
