"use client";

import { useEffect, useMemo, useState } from "react";

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
    base: "py-10 border-y border-black/15 z-10 bg-white",
  },
});

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

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visibleEntry?.target.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-10% 0px -80% 0px",
      },
    );

    headings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [articleNavItems]);

  if (articleNavItems.length === 0) {
    return null;
  }

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
                onClick={() => setActiveId(item.id)}
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
