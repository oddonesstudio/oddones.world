import Link from "next/link";
import { usePathname } from "next/navigation";

import { tv } from "@/ui/_lib/utils";

import { Text } from "../Text";

const styles = tv({
  slots: {
    base: "hover:underline [&_a]:focus:outline-none [&_a]:focus:ring-0 [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-current [&_a]:focus-visible:ring-0",
  },
  variants: {
    isActive: {
      true: "underline",
    },
    isDisabled: {
      true: "opacity-40 cursor-not-allowed",
    },
  },
});

export interface NavItemProps {
  _key: string;
  href?: string | null;
  isActive?: boolean;
  isDisabled?: boolean;
  label?: string | null;
  slug?: string | null;
}

export const NavItem = (props: NavItemProps) => {
  const pathname = usePathname();
  const href = props.href ?? (props.slug ? `/${props.slug}` : undefined);

  const { base } = styles({
    isActive: href === pathname,
    isDisabled: props.isDisabled || !href,
  });

  return (
    <li className={base()} data-atom="NavLink">
      <Text styleType="label-md">
        {href ? <Link href={href}>{props.label}</Link> : props.label}
      </Text>
    </li>
  );
};
