import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Mail } from "lucide-react";

import { tv } from "@/ui/_lib/utils";
import { Button } from "@/ui/atoms/Button";

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
        return <LinkedInLogoIcon width={20} height={20} />;
      case "github":
        return <GitHubLogoIcon width={20} height={20} />;
      case "email":
        return <Mail size={20} />;
    }
  };

  if (items.length === 0) return;

  return (
    <ul className={base()}>
      {items.map(
        (item) =>
          item.name &&
          item.url && (
            <li key={item._key}>
              <Button
                href={item.url}
                iconOnly={getSocialIcon(item.name)}
                variant="ghost"
                className="size-5"
              />
            </li>
          ),
      )}
    </ul>
  );
};
