"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanityLib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="my-6">
        <Image
          src={urlFor(value).width(1600).url()}
          width={1600}
          height={900}
          alt={value.alt || "Article image"}
          className="rounded-2xl"
        />
      </div>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value.href;
      const external = href.startsWith("http");

      return (
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="underline underline-offset-4 hover:text-brand"
        >
          {children}
        </Link>
      );
    },
  },
  block: {
    h2: ({ children }) => <h2 className="text-3xl font-semibold mt-10 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold mt-8 mb-3">{children}</h3>,
    normal: ({ children }) => <p className="leading-7 my-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6 text-lg text-gray-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-2 my-8">{children}</ul>,
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 my-8">{children}</ol>
    ),
  },
};

export function PortableTextRenderer({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}
