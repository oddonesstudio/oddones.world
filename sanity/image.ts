import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

const builder = createImageUrlBuilder({ projectId: "m6pwmjjo", dataset: "production" });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

type SanityImageUrlOptions = {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
};

export const sanityImageUrl = (
  source: SanityImageSource | null | undefined,
  options: SanityImageUrlOptions = {},
) => {
  if (!source) {
    return null;
  }

  const image = builder
    .image(source)
    .auto("format")
    .fit(options.fit ?? "crop");

  if (options.width) {
    image.width(options.width);
  }

  if (options.height) {
    image.height(options.height);
  }

  if (options.quality) {
    image.quality(options.quality);
  }

  return image.url();
};
