import { type ClassValue, clsx } from "clsx";
import { type ConfigExtension, extendTailwindMerge } from "tailwind-merge";
import { createTV } from "tailwind-variants";

const isFontSizeValue = (value: string) =>
  /^(?:display|heading|body|label)-(?:\d+|sm|md|lg|xl)$/.test(value);

const tailwindMergeConfig: ConfigExtension<never, never> = {
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [isFontSizeValue],
        },
      ],
    },
  },
};

const twMerge = extendTailwindMerge(tailwindMergeConfig);

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const tv = createTV({ twMergeConfig: tailwindMergeConfig });
