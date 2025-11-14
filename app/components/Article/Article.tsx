"use client";

import { tv } from "tailwind-variants";

import { BlogHero } from "./Hero/ArticleHero";

const styles = tv({
  slots: {
    base: "relative flex flex-col justify-center items-center text-foreground h-full min-h-screen -mt-[148px]",
    container: "w-full",
    article: "sticky bg-page-background h-screen max-w-[150rem] mx-40 z-20 -mt-40 rounded-xl",
  },
});

interface ArticleProps {
  bgColor?: string;
  featuredImage?: string;
  title?: string;
  excerpt?: string;
  pixel?: string;
}

export const Article = (props: ArticleProps) => {
  const { base, container, article } = styles();

  return (
    <div className={base()} style={{ backgroundColor: props.bgColor ?? "var(--page-dark)" }}>
      <div className={container()}>
        <BlogHero coverImage={props.featuredImage} title={props.title} excerpt={props.excerpt} />
        <div className={article()}>{/* TODO */}</div>
      </div>
    </div>
  );
};
