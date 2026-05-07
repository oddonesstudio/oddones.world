import type { ArticleContentSection } from "@/app/types/sanity";

import { Accordion } from "@/ui/content-sections/Accordion";

interface ArticlePageSectionsProps {
  getSectionHeadingId?: (key: string) => string;
  sections: ArticleContentSection[];
}

export const ArticleContentSections = ({
  getSectionHeadingId,
  sections,
}: ArticlePageSectionsProps) => {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case "accordion":
            return (
              <Accordion
                key={section._id}
                heading={section.heading ?? undefined}
                headingId={getSectionHeadingId?.(section._id)}
                summaryText={section.summaryText ?? undefined}
                items={section.items ?? []}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};
