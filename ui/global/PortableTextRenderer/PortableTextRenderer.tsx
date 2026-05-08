"use client";

import type { PortableTextMarkComponent, PortableTextTypeComponent } from "@portabletext/react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import type { PortableTextValue } from "@/app/types/sanity";
import { urlFor } from "@/sanity/image";
import { Text } from "@/ui/atoms/Text";

type PortableTextBlockValue = PortableTextValue[number];
type PortableTextImage = Extract<PortableTextBlockValue, { _type: "image" }> & {
  alt?: string | null;
};
type LinkMark = {
  _type: "link";
  _key: string;
  href?: string;
};

const getArticleHeadingId = (key?: string) => (key ? `article-heading-${key}` : undefined);

const PortableImage: PortableTextTypeComponent<PortableTextImage> = ({ value }) => {
  if (!value.asset?._ref) {
    return null;
  }

  return (
    <div className="my-10">
      <Image
        src={urlFor(value).width(1600).url()}
        width={1600}
        height={900}
        alt={value.alt ?? "Article image"}
        className="border border-black/5 shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
      />
    </div>
  );
};

const LinkMark: PortableTextMarkComponent<LinkMark> = ({ children, value }) => {
  const href = value?.href;

  if (!href) {
    return <>{children}</>;
  }

  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline text-black font-semibold underline-offset-4 transition hover:underline"
    >
      {children}
    </Link>
  );
};

const components: PortableTextComponents = {
  types: {
    image: PortableImage,
  },
  marks: {
    link: LinkMark,
    strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
    code: ({ children }) => (
      <code className="rounded-md border border-black/10 bg-black/5 px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
  },
  block: {
    h2: ({ children, value }) => (
      <Text
        as="h2"
        id={getArticleHeadingId(value._key)}
        styleType="heading-lg"
        className="mt-20 mb-6 scroll-mt-editorial text-black/80"
      >
        {children}
      </Text>
    ),
    h3: ({ children, value }) => (
      <Text
        as="h3"
        id={getArticleHeadingId(value._key)}
        styleType="heading-lg"
        className="md:not-first:mt-20 mb-6 scroll-mt-editorial text-black/80"
      >
        {children}
      </Text>
    ),
    normal: ({ children }) => (
      <Text as="p" styleType="body-md" className="not-last-of-type:mb-4 text-black/80">
        {children}
      </Text>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-black/20 pl-5 italic text-body-md text-[#4a4a4a]">
        {children}
      </blockquote>
    ),
    em: ({ children }) => <em className="font-script text-2xl not-italic">{children}</em>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 ml-5 list-disc space-y-3 text-body-md text-black/80 peer:mb-20">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 ml-5 list-decimal space-y-3 text-body-md text-black/80">{children}</ol>
    ),
    tag: ({ children }) => (
      <ul className="my-6 flex list-none flex-wrap gap-2 p-0 text-body-md text-black/80">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1 marker:text-black/40">{children}</li>,
    number: ({ children }) => <li className="pl-1 marker:text-black/40">{children}</li>,
    tag: ({ children }) => <li className="m-0 p-0">{children}</li>,
  },
};

export function PortableTextRenderer({ value }: { value?: PortableTextValue | null }) {
  if (!value || value.length === 0) {
    return null;
  }

  return <PortableText<PortableTextBlockValue> value={value} components={components} />;
}
