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
    <div className="rounded-sm flex flex-col gap-6 w-full">
      <div className="flex gap-4 items-center">
        {props.avatar && (
          <div className="relative size-[60px]">
            <Image src={props.avatar} alt="Author" fill sizes="60px" className="object-cover rounded-full" />
          </div>
        )}
        <Text as="p" styleType="body-md">
          {props.name}
        </Text>
      </div>
      <div>{props.bio && <PortableTextRenderer value={props.bio ?? null} />}</div>
      {props.socialLinks && <SocialLinks items={props.socialLinks ?? []} />}
    </div>
  );
};
