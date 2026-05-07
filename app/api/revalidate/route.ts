import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type SanityWebhookPayload = {
  _type?: string;
  slug?: string;
};

function getTagsForDocument(body: SanityWebhookPayload | null) {
  const tags = new Set<string>();

  switch (body?._type) {
    case "article":
      tags.add("sanity:article");
      tags.add("sanity:home");
      if (body.slug) {
        tags.add(`sanity:article:${body.slug}`);
        tags.add(`sanity:metadata:${body.slug}`);
      }
      break;
    case "page":
      tags.add("sanity:seo");
      if (body.slug === "/") {
        tags.add("sanity:home");
      }
      if (body.slug) {
        tags.add(`sanity:metadata:${body.slug}`);
      }
      break;
    case "siteSettings":
      tags.add("sanity:site-settings");
      break;
    case "seoSettings":
      tags.add("sanity:seo");
      break;
    case "author":
    case "button":
    case "category":
    case "pixel":
    case "tagSections":
    case "accordion":
      tags.add("sanity:article");
      tags.add("sanity:home");
      tags.add("sanity:site-settings");
      break;
    default:
      tags.add("sanity:article");
      tags.add("sanity:home");
      tags.add("sanity:seo");
      tags.add("sanity:site-settings");
      break;
  }

  return Array.from(tags);
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json({ message: "Missing SANITY_REVALIDATE_SECRET" }, { status: 500 });
  }

  const { body, isValidSignature } = await parseBody<SanityWebhookPayload>(request, secret);

  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const tags = getTagsForDocument(body);

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ revalidated: true, tags });
}
