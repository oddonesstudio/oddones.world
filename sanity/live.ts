import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-10-14",
  useCdn: true,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333",
  },
});

const token = process.env.SANITY_API_READ_TOKEN;
if (!token) {
  throw new Error("Missing SANITY_API_READ_TOKEN");
}

const { sanityFetch: sanityFetchBase, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});

export const sanityFetch = sanityFetchBase as <T = unknown>(params: {
  query: string;
}) => Promise<{ data: T | null }>;

export { SanityLive };
