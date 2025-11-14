import type { ButtonHTMLAttributes } from "react";
import { tv } from "tailwind-variants";

import { Icon, type IconProps } from "../Icon/Icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  label: string;
  onClick?: () => void;
  iconLeft?: IconProps;
  iconRight?: IconProps;
}

const button = tv({
  base: "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer gap-2",
  variants: {
    variant: {
      primary: "bg-black text-white hover:bg-gray-800",
      secondary: "bg-white text-black border border-black hover:bg-gray-100",
      ghost: "bg-transparent text-black hover:bg-gray-100",
    },
    size: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
  compoundVariants: [
    {
      variant: "secondary",
      size: "lg",
      class: "border-2",
    },
  ],
});

export const Button = (props: ButtonProps) => {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";

  return (
    <button
      type="button"
      className={button({ variant, size, className: props.className })}
      {...props}
    >
      <Icon {...props.iconLeft} />
      {props.label}
      <Icon {...props.iconRight} />
    </button>
  );
};
