import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

const builder = createImageUrlBuilder({ projectId: "m6pwmjjo", dataset: "production" });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};
