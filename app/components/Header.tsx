"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { tv } from "tailwind-variants";

import type { SiteSettings } from "@/studio/sanity.types";

import { Logo } from "./Logo";
import { PixelReveal } from "./PixelReveal/PixelReveal";

const styles = tv({
  slots: {
    base: "sticky top-0 w-full flex justify-between p-8 md:px-20 md:pt-12 md:pb-20 items-end z-30",
    logoTab: "hidden h-full md:flex items-end bg-black p-8 absolute top-0 left-20 cursor-pointer",
    logoFrame: "h-fit bg-page-background p-1 pb-2",
    nav: "flex gap-10 text-xl",
    navItem: "flex gap-2 items-center",
    navIcon: "",
  },
  variants: {
    invert: {
      true: { nav: "text-white" },
      false: {
        nav: "text-black",
      },
    },
    disabled: {
      true: {
        navItem: "opacity-40 *:cursor-not-allowed",
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      disabled: true,
      invert: true,
      className: {
        nav: "text-[#ccc]",
      },
    },
    {
      disabled: true,
      invert: false,
      className: {
        nav: "text-[#444]",
      },
    },
  ],
  defaultVariants: {
    invert: false,
    disabled: false,
  },
});

interface HeaderProps {
  background?: boolean;
  nav: SiteSettings["navigation"];
}

export const Header = (props: HeaderProps) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous === undefined) return;

    if (latest > previous && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleMouseEnter = () => {
    setHidden(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pathname = usePathname();
  const invert = ["/about", "/blog"].some((prefix) => pathname.startsWith(prefix));

  const { base, logoTab, logoFrame, nav, navItem } = styles();

  return (
    <motion.header
      data-component="Header"
      animate={hidden ? "hidden" : "visible"}
      variants={{
        visible: { y: 0, transition: { duration: 0.4, ease: "easeOut" } },
        hidden: { y: "-100%", transition: { duration: 0.4, ease: "easeIn" } },
      }}
      className={base()}
    >
      <Link href="/">
        <button type="button" className={logoTab()} onMouseEnter={handleMouseEnter}>
          <div className={logoFrame()}>
            <Logo />
          </div>
        </button>
      </Link>

      <nav>
        <ul className={nav({ invert })}>
          {props.nav?.map((item: any) => (
            <li key={item._key} className={navItem({ disabled: !item.slug })}>
              <PixelReveal svg={item.pixelIcon?.svg} />
              <Link
                href={`/${item.slug ?? ""}`}
                className={`${pathname === `/${item.slug}` && "underline"}`}
              >
                {item.label}
              </Link>
              <PixelReveal svg={item.pixelIcon?.svg} />
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
};
