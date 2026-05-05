import { ArrowDown, ArrowRight, Download, ExternalLink, Mail } from "lucide-react";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { tv } from "@/ui/_lib/utils";
import { Text } from "@/ui/atoms/Text";

export type ButtonAction = "internal" | "external" | "contact" | "download" | "anchor";

type ButtonBaseProps = {
  className?: string;
  variant?: "primary" | "primary-inverse" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  label?: string | null;
  action?: ButtonAction | null;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  iconOnly?: ReactNode;
};

export type ButtonProps =
  | (ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string });

const styles = tv({
  slots: {
    base: "group/button cursor-pointer inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed gap-3 hover:scale-[1.02] transition-transform duration-100",
  },
  variants: {
    variant: {
      primary: {
        base: "bg-black text-white outline hover:outline-2",
      },
      "primary-inverse": {
        base: "bg-page-background text-black",
      },
      secondary: {
        base: "outline hover:outline-2",
      },
      ghost: {
        base: "bg-transparent p-0!",
      },
    },
    size: {
      sm: "px-3 py-1.5 text-body-14",
      md: "px-6 py-3 text-base",
      lg: "px-6 py-3 text-lg",
    },
    iconOnly: {
      true: "p-2 w-10 h-10",
      false: {},
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

const actionIcons: Record<ButtonAction, ReactNode> = {
  internal: <ArrowRight size={18} strokeWidth={1.75} />,
  external: <ExternalLink size={18} strokeWidth={1.75} />,
  contact: <Mail size={18} strokeWidth={1.75} />,
  download: <Download size={18} strokeWidth={1.75} />,
  anchor: (
    <div className="overflow-hidden h-4.5">
      <ArrowDown
        className="group-hover/button:-translate-y-4.5 transform-transition duration-200"
        size={18}
        strokeWidth={1.75}
      />
      <ArrowDown
        className="group-hover/button:-translate-y-4.5 transform-transition duration-200"
        size={18}
        strokeWidth={1.75}
      />
    </div>
  ),
};

export const Button = (props: ButtonProps) => {
  const { label, action, iconLeft, iconRight, iconOnly, variant, size, className, ...rest } = props;
  const resolvedVariant = variant ?? "primary";
  const resolvedSize = size ?? "md";
  const resolvedIconRight = iconRight ?? (action ? actionIcons[action] : undefined);
  const { base } = styles({
    variant: resolvedVariant,
    size: resolvedSize,
    iconOnly: !!iconOnly,
  });

  const content = (
    <>
      {iconOnly}
      {iconLeft && !iconOnly ? iconLeft : null}
      {label && !iconOnly ? (
        <Text as="span" styleType="label-md">
          {label}
        </Text>
      ) : null}
      {resolvedIconRight && !iconOnly ? resolvedIconRight : null}
    </>
  );

  if ("href" in props && typeof props.href === "string") {
    const { href, ...linkProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    const isExternal = /^(https?:|mailto:|tel:)/.test(href);
    const isHashLink = href.startsWith("#");

    if (isExternal || isHashLink) {
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          className={base({ className })}
          {...linkProps}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={base({ className })} {...linkProps}>
        {content}
      </Link>
    );
  }

  const { type, ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type ?? "button"} className={base({ className })} {...buttonProps}>
      {content}
    </button>
  );
};
