import { notFound } from "next/navigation";

import { Article } from "@/app/components/Article/Article";
import { PageWrapper } from "@/app/components/PageWrapper";

import { client } from "@/sanityLib/client";
import { getMetadata } from "@/sanityLib/getMetadata";
import { urlFor } from "@/sanityLib/image";

import type { Article as ArticleType } from "@/studio/sanity.types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return getMetadata({ slug });
}

export type BackgroundColor = NonNullable<ArticleType["backgroundColor"]>;
export type BackgroundColorMap = Record<BackgroundColor, string | undefined>;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const query = `
    *[_type == "article" && slug.current == $slug][0]{
      title,
      body,
      coverImage {
        asset->{
          url,
          metadata {
            palette {
              dominant {
                background,
                foreground,
                population,
              },
              vibrant {
                background,
                foreground
              },
              muted {
                background,
                foreground
              }
            },
            blurHash
          }
        }
      },
      backgroundColor,
      excerpt,
      "pixel": icon->svg
    }
  `;

  const data = await client.fetch(query, { slug });

  if (!data) return notFound();

  const featuredImage = data.coverImage ? urlFor(data.coverImage).width(2000).url() : "";
  const mutedBgColor = data.coverImage?.asset?.metadata.palette.muted.background;
  const vibrantBgColor = data.coverImage?.asset?.metadata.palette.vibrant.background;
  const dominantBgColor = data.coverImage?.asset?.metadata.palette.dominant.background;

  const bgColor: BackgroundColorMap = {
    muted: mutedBgColor,
    vibrant: vibrantBgColor,
    dominant: dominantBgColor,
  };

  return (
    <div className="mt-[calc(var(--header-height)*-1)] pb-[537px]">
      <Article
        bgColor={bgColor[data.backgroundColor as BackgroundColor]}
        featuredImage={featuredImage}
        title={data.title}
        body={data.body}
        excerpt={data.excerpt}
        pixel={data.pixel}
      />
    </div>
  );
}
