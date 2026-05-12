export type ButtonHrefSource = {
  href?: string | null;
  action?: "internal" | "external" | "contact" | "download" | "anchor" | null;
  linkType?: "page" | "article" | "anchor" | "contact" | null;
  pageSlug?: string | null;
  articleSlug?: string | null;
  anchor?: string | null;
  externalURL?: string | null;
  contact?: string | null;
  download?: {
    asset: {
      url?: string | null;
    } | null;
  } | null;
};

const normalizePageSlug = (slug: string) => {
  if (slug === "/") {
    return "/";
  }
  return slug.startsWith("/") ? slug : `/${slug}`;
};

const normalizeArticleSlug = (slug: string) => {
  if (slug.startsWith("/article/")) {
    return slug;
  }
  const trimmed = slug.startsWith("/") ? slug.slice(1) : slug;
  return `/article/${trimmed}`;
};

const normalizeAnchor = (anchor: string) => (anchor.startsWith("#") ? anchor : `#${anchor}`);

const normalizeContact = (contact: string) => {
  if (/^(mailto:|tel:)/.test(contact)) {
    return contact;
  }

  return contact.includes("@") ? `mailto:${contact}` : contact;
};

const normalizeDownload = (download: string) => {
  return download.trim() || undefined;
};

export const resolveButtonHref = (source?: ButtonHrefSource | null) => {
  if (!source) {
    return undefined;
  }

  switch (source.action) {
    case "external":
      return source.externalURL ?? undefined;
    case "anchor":
      return source.anchor ? normalizeAnchor(source.anchor) : undefined;
    case "contact":
      return source.contact ? normalizeContact(source.contact) : "mailto:soph@oddones.world";
    case "download":
      return source.download?.asset?.url ? normalizeDownload(source.download.asset.url) : undefined;
    case "internal":
      break;
    default:
      break;
  }

  switch (source.linkType) {
    case "page":
      return source.pageSlug ? normalizePageSlug(source.pageSlug) : undefined;
    case "article":
      return source.articleSlug ? normalizeArticleSlug(source.articleSlug) : undefined;
    case "anchor":
      return source.anchor ? normalizeAnchor(source.anchor) : undefined;
    case "contact":
      return source.contact ? normalizeContact(source.contact) : "mailto:soph@oddones.world";
    default:
      return source.href ?? undefined;
  }
};
