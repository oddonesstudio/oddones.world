"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";
import { tv } from "tailwind-variants";

import { Container } from "@/app/components/Container/Container";
import { ArticleHero } from "@/app/components/Hero/ArticleHero";
import { PortableTextRenderer } from "@/app/components/PortableTextRenderer/PortableTextRenderer";
import { TagList } from "@/app/components/TagList";

const styles = tv({
  slots: {
    base: "relative flex flex-col items-center text-foreground h-full min-h-screen text-black rounded-xl overflow-hidden",
    article: "sticky bg-page-background z-20 -mt-40",
  },
});

interface ArticleProps {
  bgColor?: string;
  fgColor?: string;
  featuredImage?: string;
  title: string | null;
  author: {
    name: string | null;
    avatar?: string | null;
    bio?: string | null;
  };
  body: any | null;
  excerpt: string | null;
  pixel: string | null;
  accessOverlay?: ReactNode;
  tags?: {
    heading?: string;
    groups?: {
      emoji?: string;
      tags?: string[];
    }[];
  }[];
  primaryCta?: {
    label?: string;
    type?: "internal" | "external" | "download";
  };
}

const getContrastText = (hexColor: string) => {
  const hex = hexColor.replace("#", "").trim();
  if (![3, 6].includes(hex.length) || !/^[0-9a-fA-F]+$/.test(hex)) return null;
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#000000" : "#ffffff";
};

const getContrastTextFromColor = (color: string) => {
  if (color.startsWith("hsl")) {
    const match = color.match(/hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*(\d+)%\s*\)/i);
    if (!match) return null;
    const lightness = Number.parseInt(match[1] ?? "", 10);
    if (Number.isNaN(lightness)) return null;
    return lightness > 60 ? "#000000" : "#ffffff";
  }
  return getContrastText(color);
};

export const Article = (props: ArticleProps) => {
  const { base, article } = styles();

  return (
    <div className={base()}>
      {props.accessOverlay}
      <ArticleHero
        coverImage={props.featuredImage}
        title={props.title}
        excerpt={props.excerpt}
        primaryCta={props.primaryCta}
      />
      <div className={article()}>
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%]">
          {/* Sidebar */}
          <aside className="hidden lg:block sticky top-(--header-height) space-y-8 p-6">
            {/* Author */}
            {props.author && (
              <div className="rounded-lg bg-black w-full p-10 text-white flex flex-col gap-6">
                <div className="flex gap-6 items-center">
                  <Image
                    src={props.author.avatar || ""}
                    alt="Author"
                    width={50}
                    height={50}
                    className="rounded-full mb-4"
                  />
                  <h2 className="text-2xl font-heading mb-4 uppercase">{props.author.name}</h2>
                </div>
                <p>{props.author.bio}</p>
              </div>
            )}
            {/* Tags */}
            {props.tags && props.tags.length > 0 && (
              <div className="rounded-lg bg-black w-full p-10">
                <TagList sections={props.tags} />
              </div>
            )}
          </aside>
          <Container className="py-20 min-h-screen">
            <PortableTextRenderer value={props.body} />
          </Container>
        </div>
      </div>
    </div>
  );
};
