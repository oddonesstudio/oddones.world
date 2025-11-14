import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = createImageUrlBuilder({ projectId: "m6pwmjjo", dataset: "production" });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};
