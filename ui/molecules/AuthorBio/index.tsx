import Image from "next/image";

import type { PortableTextValue } from "@/app/types/sanity";

import { Text } from "@/ui/atoms/Text";
import { PortableTextRenderer } from "@/ui/global/PortableTextRenderer/PortableTextRenderer";
import { type SocialLink, SocialLinks } from "../SocialLinks";

export const AuthorBio = (props: {
  name: string | null;
  avatar?: string | null;
  bio?: PortableTextValue | null;
  socialLinks?: SocialLink[];
}) => {
  return (
    <div className="rounded-sm flex flex-col gap-6 md:gap-10 w-full">
      <div className="flex gap-6 items-center">
        {props.avatar && (
          <Image
            src={props.avatar}
            alt="Author"
            width={50}
            height={50}
            className="object-cover rounded-full size-[50px]"
          />
        )}
        <Text as="h2" styleType="label-md">
          {props.name}
        </Text>
      </div>
      <div>{props.bio && <PortableTextRenderer value={props.bio ?? null} />}</div>
      {props.socialLinks && <SocialLinks items={props.socialLinks ?? []} />}
    </div>
  );
};
