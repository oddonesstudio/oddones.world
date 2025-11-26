"use client";

import type { ReactNode } from "react";
import { tv } from "tailwind-variants";

import { Container } from "../Container/Container";
import { PortableTextRenderer } from "../PortableTextRenderer/PortableTextRenderer";

import { BlogHero } from "./Hero/ArticleHero";

const styles = tv({
  slots: {
    base: "relative flex flex-col items-center text-foreground h-full min-h-screen text-black",
    container: "w-full",
    article: "sticky bg-page-background z-20 -mt-40",
  },
});

interface ArticleProps {
  bgColor?: string;
  featuredImage?: string;
  title?: string;
  body?: ReactNode;
  excerpt?: string;
  pixel?: string;
}

export const Article = (props: ArticleProps) => {
  const { base, container, article } = styles();

  return (
    <div
      className={base()}
      style={{
        backgroundColor: props.bgColor ?? "var(--page-dark)",
      }}
    >
      <div className={container()}>
        <BlogHero coverImage={props.featuredImage} title={props.title} excerpt={props.excerpt} />
        <div className={article()}>
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16">
            <aside className="hidden lg:block sticky top-(--header-height) space-y-8"></aside>
            <Container className="py-20 min-h-screen">
              <PortableTextRenderer value={props.body} />
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};
