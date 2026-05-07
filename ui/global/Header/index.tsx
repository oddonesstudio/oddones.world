"use client";

import type { Variants } from "framer-motion";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Popover } from "radix-ui";
import React from "react";

import { useAppUi } from "@/app/components/AppUiContext";
import type { Navigation } from "@/app/types/sanity";
import { getScrollRevealState } from "@/app/utils/scroll";

import { cn, tv } from "@/ui/_lib/utils";
import type { ButtonAction } from "@/ui/atoms/Button";
import { LogoTab } from "@/ui/atoms/LogoTab";
import { NavItem } from "@/ui/atoms/NavItem";
import { Container } from "../Container";

const styles = tv({
  slots: {
    base: "pointer-events-none absolute left-0 w-full",
    motionContainer: "pointer-events-auto md:fixed top-0 left-0 w-full flex",
    nav: "hidden group/nav md:flex gap-6",
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
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
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

  const { base, motionContainer, nav } = styles();
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
  const handleMobileNavClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setMobileNavOpen(false);
    }
  };

  return (
    <header ref={headerRef} className={headerClassName} data-component="Header">
      <motion.div
        className={motionContainer()}
        animate={revealState}
        variants={headerRevealVariants}
      >
        <Container className="flex justify-between items-center pt-0! pb-0">
          <LogoTab onHover={notifyLogoTabHover} />
          <motion.nav
            className="relative"
            animate={navAnimationState}
            variants={navRevealVariants}
            style={{ pointerEvents: navAnimationState === "hidden" ? "none" : "auto" }}
          >
            <Popover.Root open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <Popover.Trigger asChild>
                <button
                  className="inline-flex items-center justify-center p-3 text-page-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page-foreground md:hidden"
                  type="button"
                  aria-label="Open navigation menu"
                >
                  <Menu aria-hidden="true" size={24} strokeWidth={2.5} />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  align="end"
                  sideOffset={10}
                  className="z-[80] w-48 border-2 border-black bg-page-background px-4 py-3 text-page-foreground shadow-custom md:hidden"
                  onClick={handleMobileNavClick}
                >
                  <ul className="flex flex-col gap-3 font-mono text-xs uppercase tracking-normal">
                    {props.nav?.map((item: Navigation[number]) => (
                      <NavItem key={item._key} {...item} />
                    ))}
                  </ul>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
            <ul className={cn(nav(), isArticleRoute || articleModalExpanded ? "text-white" : "")}>
              {props.nav?.map((item: Navigation[number]) => (
                <NavItem key={item._key} {...item} />
              ))}
            </ul>
          </motion.nav>
        </Container>
      </motion.div>
    </header>
  );
};
