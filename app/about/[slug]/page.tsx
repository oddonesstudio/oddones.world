import { notFound } from "next/navigation";

import type { BackgroundColor, BackgroundColorMap } from "@/app/article/[slug]/page";
import { Article } from "@/app/layouts/Article/Article";
import { PageWrapper } from "@/app/components/PageWrapper";

import { getMetadata } from "@/sanity/getMetadata";
import { urlFor } from "@/sanity/image";
import { sanityFetch } from "@/sanity/live";

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

  const { data } = await sanityFetch({ query, params: { slug } });

  if (!data) return notFound();

  const featuredImage = data.coverImage ? urlFor(data.coverImage).width(2000).url() : "";
  const mutedBgColor = data.coverImage?.asset?.metadata?.palette?.muted?.background;
  const vibrantBgColor = data.coverImage?.asset?.metadata?.palette?.vibrant?.background;
  const dominantBgColor = data.coverImage?.asset?.metadata?.palette?.dominant?.background;
  const mutedFgColor = data.coverImage?.asset?.metadata?.palette?.muted?.foreground;
  const vibrantFgColor = data.coverImage?.asset?.metadata?.palette?.vibrant?.foreground;
  const dominantFgColor = data.coverImage?.asset?.metadata?.palette?.dominant?.foreground;

  const bgColor: BackgroundColorMap = {
    muted: mutedBgColor,
    vibrant: vibrantBgColor,
    dominant: dominantBgColor,
  };
  const fgColor: BackgroundColorMap = {
    muted: mutedFgColor,
    vibrant: vibrantFgColor,
    dominant: dominantFgColor,
  };

  return (
    <PageWrapper>
      <Article
        bgColor={bgColor[data.backgroundColor as BackgroundColor]}
        fgColor={fgColor[data.backgroundColor as BackgroundColor]}
        featuredImage={featuredImage}
        title={data.title}
        body={data.body}
        excerpt={data.excerpt}
        pixel={data.pixel}
      />
    </PageWrapper>
  );
}
