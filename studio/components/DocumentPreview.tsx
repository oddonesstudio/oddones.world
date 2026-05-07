import {
  urlSearchParamPreviewPathname,
  urlSearchParamPreviewPerspective,
  urlSearchParamPreviewSecret,
} from "@sanity/preview-url-secret/constants";
import { createPreviewSecret } from "@sanity/preview-url-secret/create-secret";
import { Card, Flex, Spinner, Text } from "@sanity/ui";
import { useEffect, useMemo, useState } from "react";
import type { SchemaType } from "sanity";
import { useClient } from "sanity";

type PreviewDocument = {
  slug?: {
    current?: string | null;
  } | null;
};

type DocumentPreviewProps = {
  document: {
    displayed?: PreviewDocument;
  };
  schemaType: SchemaType;
};

const previewBaseUrl = process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000";

function resolvePreviewPath(schemaTypeName: string, slug?: string | null): string | null {
  if (!slug) return null;

  if (schemaTypeName === "page") {
    return slug === "/" ? "/" : `/${slug}`;
  }

  if (schemaTypeName === "article") {
    return `/article/${slug}`;
  }

  return null;
}

export function DocumentPreview({ document, schemaType }: DocumentPreviewProps) {
  const client = useClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const displayedSlug = document.displayed?.slug?.current;
  const previewPath = useMemo(
    () => resolvePreviewPath(schemaType.name, displayedSlug),
    [schemaType.name, displayedSlug],
  );

  useEffect(() => {
    let cancelled = false;

    async function buildPreviewUrl() {
      setError(null);
      setPreviewUrl(null);

      if (!previewPath) {
        setError("Add a slug to enable preview.");
        return;
      }

      try {
        const { secret } = await createPreviewSecret(
          client,
          "document-preview",
          window.location.origin,
        );

        const url = new URL("/api/draft", previewBaseUrl);
        url.searchParams.set(urlSearchParamPreviewSecret, secret);
        url.searchParams.set(urlSearchParamPreviewPerspective, "drafts");
        if (previewPath !== "/") {
          url.searchParams.set(urlSearchParamPreviewPathname, previewPath);
        }

        if (!cancelled) {
          setPreviewUrl(url.toString());
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to create preview URL.");
        }
        console.error(err);
      }
    }

    buildPreviewUrl();

    return () => {
      cancelled = true;
    };
  }, [client, previewPath]);

  if (error) {
    return (
      <Card padding={4} tone="caution">
        <Text>{error}</Text>
      </Card>
    );
  }

  if (!previewUrl) {
    return (
      <Card padding={4}>
        <Flex align="center" gap={3}>
          <Spinner />
          <Text>Loading preview…</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card padding={0} style={{ height: "100%" }}>
      <iframe
        title="Document preview"
        src={previewUrl}
        style={{ border: 0, width: "100%", height: "100%" }}
      />
    </Card>
  );
}
