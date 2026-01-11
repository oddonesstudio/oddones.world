import { draftMode } from "next/headers";
import { client, previewClient } from "./client";

type SanityFetchProps = {
  query: string;
  params?: Record<string, any>;
  revalidate?: number;
  tags?: string[];
};

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: SanityFetchProps): Promise<T> {
  const draft = await draftMode();
  const isDraft = draft.isEnabled;

  const sanityClient = isDraft ? previewClient : client;

  return sanityClient.fetch(query, params, {
    cache: isDraft ? "no-store" : undefined,
    next: isDraft ? undefined : { revalidate, tags },
  });
}
