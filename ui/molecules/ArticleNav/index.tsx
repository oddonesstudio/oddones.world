"use client";

import { type MouseEvent, useEffect, useMemo, useState } from "react";

import { Z_INDEX_CLASS } from "@/app/constants/ui";
import type { ArticleContentSection, PortableTextValue } from "@/app/types/sanity";
import { tv } from "@/ui/_lib/utils";

type ArticleNavItem = {
  id: string;
  title: string;
};

const getBlockText = (block: Extract<PortableTextValue[number], { _type: "block" }>) =>
  block.children
    ?.map((child) => child.text ?? "")
    .join("")
    .trim() ?? "";

const getArticleHeadingId = (key: string) => `article-heading-${key}`;

const getContentSectionHeadingId = (key: string) => `content-section-${key}`;

const styles = tv({
  slots: {
    base: `${Z_INDEX_CLASS.local} bg-white`,
  },
});

const getScrollContainer = (element: HTMLElement): HTMLElement | Window => {
  let parent = element.parentElement;

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);

    if (/(auto|scroll|overlay)/.test(overflowY) && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return window;
};

const scrollToHeading = (heading: HTMLElement) => {
  const scrollContainer = getScrollContainer(heading);
  const scrollMarginTop = Number.parseFloat(window.getComputedStyle(heading).scrollMarginTop) || 0;
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

  if (scrollContainer instanceof Window) {
    scrollContainer.scrollTo({
      top: heading.getBoundingClientRect().top + window.scrollY - scrollMarginTop,
      behavior,
    });
    return;
  }

  scrollContainer.scrollTo({
    top:
      heading.getBoundingClientRect().top -
      scrollContainer.getBoundingClientRect().top +
      scrollContainer.scrollTop -
      scrollMarginTop,
    behavior,
  });
};

export const ArticleNav = ({
  body,
  contentSections,
}: {
  body: PortableTextValue | null;
  contentSections: ArticleContentSection[];
}) => {
  const [activeId, setActiveId] = useState<string>();

  const articleNavItems: ArticleNavItem[] = useMemo(
    () => [
      ...(body?.flatMap((block) => {
        if (block._type !== "block" || (block.style !== "h2" && block.style !== "h3")) {
          return [];
        }

        const title = getBlockText(block);

        if (!title) {
          return [];
        }

        return [
          {
            id: getArticleHeadingId(block._key),
            title,
          },
        ];
      }) ?? []),
      ...contentSections.flatMap((section) => {
        if (section._type !== "accordion" || !section.heading || section.items?.length === 0) {
          return [];
        }

        return [
          {
            id: getContentSectionHeadingId(section._id),
            title: section.heading,
          },
        ];
      }),
    ],
    [body, contentSections],
  );

  useEffect(() => {
    const headings = articleNavItems
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => heading !== null);

    if (headings.length === 0) {
      return;
    }

    const scrollContainer = getScrollContainer(headings[0]);
    let frameId: number | undefined;
    let scrollMarginTops = headings.map(
      (heading) => Number.parseFloat(window.getComputedStyle(heading).scrollMarginTop) || 0,
    );

    const updateActiveHeading = () => {
      const viewportTop =
        scrollContainer instanceof Window ? 0 : scrollContainer.getBoundingClientRect().top;
      let activeHeading = headings[0];

      for (let index = 0; index < headings.length; index += 1) {
        const activationTop = viewportTop + scrollMarginTops[index] + 2;

        if (headings[index].getBoundingClientRect().top > activationTop) {
          break;
        }

        activeHeading = headings[index];
      }

      setActiveId((currentActiveId) => {
        return currentActiveId === activeHeading.id ? currentActiveId : activeHeading.id;
      });
    };

    const onScroll = () => {
      if (frameId !== undefined) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = undefined;
        updateActiveHeading();
      });
    };

    const onResize = () => {
      scrollMarginTops = headings.map(
        (heading) => Number.parseFloat(window.getComputedStyle(heading).scrollMarginTop) || 0,
      );
      onScroll();
    };

    updateActiveHeading();
    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId);
      }

      scrollContainer.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [articleNavItems]);

  if (articleNavItems.length === 0) {
    return null;
  }

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, itemId: string) => {
    const heading = document.getElementById(itemId);

    if (!heading) {
      return;
    }

    event.preventDefault();
    setActiveId(itemId);
    history.pushState(null, "", `#${itemId}`);
    scrollToHeading(heading);
  };

  const { base } = styles();

  return (
    <nav aria-label="Article sections" className={base()}>
      <ul className="space-y-2 text-sm font-medium leading-tight text-black/60">
        {articleNavItems.map((item) => {
          const isActive = activeId === item.id;

          return (
            <li key={item.id}>
              <a
                aria-current={isActive ? "location" : undefined}
                className={`block border-l-2 py-1 pr-2 pl-3 transition hover:border-black hover:text-black ${
                  isActive ? "border-black text-black" : "border-transparent"
                }`}
                href={`#${item.id}`}
                onClick={(event) => handleNavClick(event, item.id)}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
