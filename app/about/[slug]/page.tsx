import { notFound } from "next/navigation";

import type { BackgroundColor, BackgroundColorMap } from "@/app/blog/[slug]/page";
import { Article } from "@/app/components/Article/Article";
import { PageWrapper } from "@/app/components/PageWrapper";

import { client } from "@/sanity/client";
import { getMetadata } from "@/sanity/getMetadata";
import { urlFor } from "@/sanity/image";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return getMetadata({ slug });
}

export default async function AboutArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const query = `
    *[_type == "article" && slug.current == $slug][0]{
      title,
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
  	  "pixelAsset": pixelAsset->svg
    }
  `;

  const data = await client.fetch(query, { slug });

  if (!data) return notFound();

  const featuredImage = data.coverImage ? urlFor(data.coverImage).width(2000).url() : "";
  const mutedBgColor = data.coverImage?.asset?.metadata?.palette?.muted?.background;
  const vibrantBgColor = data.coverImage?.asset?.metadata?.palette?.vibrant?.background;
  const dominantBgColor = data.coverImage?.asset?.metadata?.palette?.dominant?.background;

  const bgColor: BackgroundColorMap = {
    muted: mutedBgColor,
    vibrant: vibrantBgColor,
    dominant: dominantBgColor,
  };

  return (
    <PageWrapper>
      <Article
        bgColor={bgColor[data.backgroundColor as BackgroundColor]}
        featuredImage={featuredImage}
        title={data.title}
        excerpt={data.excerpt}
        pixel={data.pixelAsset}
      />
    </PageWrapper>
  );
}
