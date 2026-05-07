import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Mail } from "lucide-react";

import { tv } from "@/ui/_lib/utils";

export type SocialLink = {
  _key: string;
  name?: "linkedin" | "github" | "email";
  url?: string;
};

interface SocialLinksProps {
  items: SocialLink[];
}

const styles = tv({
  slots: {
    base: "flex gap-4",
  },
});

export const SocialLinks = ({ items }: SocialLinksProps) => {
  const { base } = styles();

  const getSocialIcon = (name: string) => {
    switch (name) {
      case "linkedin":
        return <LinkedInLogoIcon width={24} height={24} />;
      case "github":
        return <GitHubLogoIcon width={24} height={24} />;
      case "email":
        return <Mail />;
    }
  };

  if (items.length === 0) return;

  return (
    <ul className={base()}>
      {items.map((item) => item.name && <li key={item._key}>{getSocialIcon(item.name)}</li>)}
    </ul>
  );
};
