"use client";

import type { Variants } from "framer-motion";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

import { useAppUi } from "@/app/components/AppUiContext";
import type { Navigation } from "@/app/types/sanity";
import { getScrollRevealState } from "@/app/utils/scroll";

import { cn, tv } from "@/ui/_lib/utils";
import type { ButtonAction } from "@/ui/atoms/Button";
import { LogoTab } from "@/ui/atoms/LogoTab";
import { NavItem } from "@/ui/atoms/NavItem";

const styles = tv({
  slots: {
    base: "pointer-events-none absolute left-0 w-full h-(--header-height) flex items-center justify-end",
    logoTab: "pointer-events-auto fixed top-0 left-0 md:left-20 cursor-pointer",
    nav: "group/nav flex gap-6",
    // nav: "pointer-events-auto fixed top-0 right-8 md:right-20 flex h-(--header-height) items-center"
  },
});

const headerRevealVariants: Variants = {
  visible: { y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  hidden: { y: "-100%", transition: { duration: 0.4, ease: "easeIn" } },
};

const navRevealVariants: Variants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  hidden: { opacity: 0, y: -16, transition: { duration: 0.2, ease: "easeIn" } },
};

interface HeaderProps {
  nav?: Navigation | null;
  headerCTA?: {
    label?: string | null;
    href?: string;
    action?: ButtonAction | null;
  } | null;
}

export const Header = (props: HeaderProps) => {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { articleModal, notifyLogoTabHover } = useAppUi();
  const headerRef = React.useRef<HTMLElement>(null);
  const previousArticleModalScrollRef = React.useRef(0);
  const [hidden, setHidden] = React.useState(false);
  const [pageScrolled, setPageScrolled] = React.useState(false);
  const [articleModalScrolled, setArticleModalScrolled] = React.useState(false);

  const isArticleRoute = pathname?.startsWith("/article/");
  const articleModalOpen = articleModal.open;
  const articleModalExpanded = articleModal.expanded;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (articleModalExpanded) return;

    const previous = scrollY.getPrevious();
    if (previous === undefined) return;

    const revealState = getScrollRevealState(latest, previous);

    setPageScrolled(revealState.scrolled);
    setHidden(revealState.hidden);
  });

  React.useEffect(() => {
    if (articleModalExpanded) {
      setHidden(false);
      setArticleModalScrolled(false);
      previousArticleModalScrollRef.current = 0;
      return;
    }

    setArticleModalScrolled(false);
  }, [articleModalExpanded]);

  React.useEffect(() => {
    if (!articleModalExpanded) {
      previousArticleModalScrollRef.current = 0;
      setArticleModalScrolled(false);
    }
  }, [articleModalExpanded]);

  React.useEffect(() => {
    if (!articleModalExpanded) return;

    const scrollTop = articleModal.scrollTop;
    const previous = previousArticleModalScrollRef.current;
    const revealState = getScrollRevealState(scrollTop, previous);

    setArticleModalScrolled(revealState.scrolled);
    setHidden(revealState.hidden);

    previousArticleModalScrollRef.current = scrollTop;
  }, [articleModal.scrollTop, articleModalExpanded]);

  const { base, logoTab, nav } = styles();
  const headerClassName = base({
    className: articleModalExpanded ? "z-[70]" : articleModalOpen ? "z-30" : "z-50",
  });

  const revealState = hidden ? "hidden" : "visible";
  const navRevealState = articleModalExpanded && articleModalScrolled ? "hidden" : "visible";
  const navAnimationState = articleModalExpanded
    ? navRevealState
    : pageScrolled
      ? "hidden"
      : "visible";

  return (
    <header ref={headerRef} className={headerClassName} data-component="Header">
      <motion.div className={logoTab()} animate={revealState} variants={headerRevealVariants}>
        <LogoTab onHover={notifyLogoTabHover} />
      </motion.div>

      <motion.nav
        className={nav()}
        animate={navAnimationState}
        variants={navRevealVariants}
        style={{ pointerEvents: navAnimationState === "hidden" ? "none" : "auto" }}
      >
        <ul className={cn(nav(), isArticleRoute || articleModalExpanded ? "text-white" : "")}>
          {props.nav?.map((item: Navigation[number]) => (
            <NavItem key={item._key} {...item} />
          ))}
        </ul>
      </motion.nav>
    </header>
  );
};
