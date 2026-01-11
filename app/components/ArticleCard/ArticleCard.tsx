import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, FC } from "react";

import { cn } from "@/app/utils/cn";
import { ArticleGridArticle } from "../ArticleGrid/ArticleGrid";

type ArticleCardVariant = "default" | "one" | "two" | "three" | "four" | "five";

interface ArticleCardComponentProps extends ArticleGridArticle {
  className?: string;
  variant?: ArticleCardVariant;
  style?: CSSProperties;
}

const Placeholder = () => (
  <div className="h-full w-full bg-[#fdf6e6]">
    <div className="h-full w-full bg-[linear-gradient(135deg,_rgba(0,0,0,0.05)_25%,_transparent_25%,_transparent_50%,_rgba(0,0,0,0.05)_50%,_rgba(0,0,0,0.05)_75%,_transparent_75%,_transparent_100%)] [background-size:32px_32px]" />
  </div>
);

const MEDIA_VARIANT: Record<ArticleCardVariant, string> = {
  one: "min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]",
  two: "min-h-[260px] sm:min-h-[320px]",
  three: "min-h-[320px]",
  four: "min-h-[220px] lg:min-h-[260px]",
  five: "aspect-[3/4]",
  default: "aspect-[3/4]",
};

const TITLE_VARIANT: Record<ArticleCardVariant, string> = {
  one: "text-3xl",
  two: "text-2xl",
  three: "text-xl",
  four: "text-xl",
  five: "text-lg",
  default: "text-lg",
};

export const ArticleCard: FC<ArticleCardComponentProps> = ({
  slug,
  title,
  excerpt,
  coverImage,
  className,
  variant = "default",
  style,
}) => {
  const content = (
    <article className="group relative flex h-full flex-col overflow-hidden bg-[#f9f2e4] shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-[transform,box-shadow] duration-300 group hover:shadow-[0_25px_80px_rgba(0,0,0,0.25)] rounded-2xl">
      <div className={cn("relative h-full w-full", MEDIA_VARIANT[variant])}>
        {coverImage ? (
          <Image
            src={coverImage.asset?.url || ""}
            alt={title ?? "Article cover"}
            fill
            // sizes={
            //   variant === "one"
            //     ? "(min-width: 1024px) 50vw, 100vw"
            //     : variant === "four"
            //       ? "(min-width: 1024px) 40vw, 80vw"
            //       : "(min-width: 1024px) 25vw, 60vw"
            // }
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={variant === "one"}
          />
        ) : (
          <Placeholder />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 text-white">
          {title && (
            <h3 className={cn("font-semibold leading-tight", TITLE_VARIANT[variant])}>{title}</h3>
          )}
          {excerpt && <p className="hidden group-hover:block text-sm text-white/85">{excerpt}</p>}
        </div>
      </div>
    </article>
  );

  const wrapperClass = cn("h-full w-full", className);

  if (slug) {
    return (
      <div className={wrapperClass} style={style}>
        <Link
          href={`/article/${slug}`}
          className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
        >
          {content}
        </Link>
      </div>
    );
  }

  return (
    <div className={wrapperClass} style={style}>
      {content}
    </div>
  );
};
