import { ArticleContentSections } from "@/app/components/ArticleContentSections";
import type { PixelPuzzle, PortableTextValue } from "@/app/types/sanity";

import type { ArticleQueryResult } from "@/studio/sanity.types";

import { tv } from "@/ui/_lib/utils";
import type { ButtonAction } from "@/ui/atoms/Button";
import { ArticleHero } from "@/ui/components/ArticleHero/ArticleHero";
import { Container } from "@/ui/global/Container";
import { PortableTextRenderer } from "@/ui/global/PortableTextRenderer/PortableTextRenderer";
import { ArticleNav } from "@/ui/molecules/ArticleNav";
import { AuthorBio } from "@/ui/molecules/AuthorBio";

type ContentSections = NonNullable<NonNullable<ArticleQueryResult>["contentSections"]>;

type TagSection = {
  key: string;
  heading: string;
  tagGroups: {
    _key: string;
    heading: string;
    tags: string[];
  }[];
};

type ArticleCTA = {
  label?: string | null;
  href?: string;
  action?: ButtonAction | null;
};

interface ArticleProps {
  coverImage?: string;
  textLayoutId?: string;
  title: string | null;
  author: {
    name: string | null;
    avatar?: string | null;
    bio?: PortableTextValue | null;
  };
  body: PortableTextValue | null;
  excerpt: string | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
  pixel?: PixelPuzzle | null;
  isPrivate?: boolean;
  unlockStorageKey?: string;
  tagSections?: TagSection[];
  primaryCTA?: ArticleCTA | null;
  secondaryCTA?: ArticleCTA | null;
  contentSections?: ContentSections;
  stickyContent?: boolean;
  modalPreview?: boolean;
}

const getContentSectionHeadingId = (key: string) => `content-section-${key}`;

const styles = tv({
  slots: {
    base: "relative flex h-full min-h-full flex-col items-stretch text-foreground text-black",
    body: "bg-white max-w-full flex flex-col lg:gap-20 md:pt-[calc(var(--editorial)/2)]",
    grid: "grid lg:grid-cols-3 gap-10 lg:gap-20",
    aside: "flex flex-col gap-10 lg:gap-20 lg:col-span-1 lg:sticky lg:top-10 lg:h-fit",
  },
  variants: {
    isModal: {
      true: "",
      false: { body: "pb-(--footer-height)" },
    },
  },
});

export const ArticleLayout = (props: ArticleProps) => {
  const { base, body, grid, aside } = styles({
    isModal: props.modalPreview,
  });
  const coverImageSizes = props.modalPreview
    ? "(min-width: 1556px) 1400px, (min-width: 1024px) 90vw, 100vw"
    : "100vw";

  return (
    <article className={base()}>
      <ArticleHero {...props} imageSizes={coverImageSizes} />
      <Container width="editorial" className={body()}>
        <div className={grid()}>
          <aside className={aside()}>
            {props.author.name && <AuthorBio {...props.author} />}
            <ArticleNav body={props.body} contentSections={props.contentSections || []} />
          </aside>
          <div className="lg:col-span-2">
            <PortableTextRenderer value={props.body} />
          </div>
        </div>
        <ArticleContentSections
          getSectionHeadingId={getContentSectionHeadingId}
          sections={props.contentSections || []}
        />
      </Container>
    </article>
  );
};
