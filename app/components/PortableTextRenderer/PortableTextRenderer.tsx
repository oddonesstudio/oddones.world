"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";

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
    accordion: ({ value }) => {
      const heading = value?.title;
      const items = Array.isArray(value?.items) ? value.items : [];

      if (!heading && items.length === 0) {
        return null;
      }

      return (
        <div className="my-10 space-y-5">
          {heading ? <h3 className="text-2xl font-semibold">{heading}</h3> : null}
          <div className="space-y-3">
            {items.map((item: any, index: number) => {
              const title = item?.title || `Item ${index + 1}`;
              const content = item?.content ?? item?.body ?? item?.text;

              return (
                <details
                  key={item?._key || index}
                  className="group rounded-xl border border-gray-200 bg-white/70 p-5 shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium">
                    <span>{title}</span>
                    <span className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 transition-transform duration-200 group-open:rotate-180">
                      <svg
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="h-4 w-4"
                      >
                        <path
                          d="M5.5 7.5L10 12l4.5-4.5"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-base leading-7 text-gray-700">
                    {Array.isArray(content) ? (
                      <PortableText value={content} components={components} />
                    ) : (
                      <p>{content}</p>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      );
    },
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
