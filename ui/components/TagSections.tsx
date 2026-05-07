import { tv } from "@/ui/_lib/utils";
import { Text } from "@/ui/atoms/Text";

interface TagSectionsProps {
  items: {
    key: string;
    heading: string;
    tagGroups: {
      _key: string;
      heading: string;
      tags: string[];
    }[];
  }[];
}

const styles = tv({
  slots: {
    base: "",
    container: "flex flex-col gap-6",
    tagGroup: "flex flex-col gap-4",
    tagText: "pr-2 flex gap-2 w-fit text-black/80",
  },
});

export const TagSections = (props: TagSectionsProps) => {
  const { base, container, tagGroup, tagText } = styles();

  return (
    <div className={base()} data-component="TagSection">
      {props.items.map((item) => (
        <div key={item.key} className={container()}>
          <Text as="h3" styleType="heading-md">
            {item.heading}
          </Text>
          {item.tagGroups.map((group) => (
            <div key={group._key} className={tagGroup()}>
              <Text as="h4" styleType="body-md" className="font-bold">
                {group.heading}
              </Text>

              <div className="flex flex-wrap">
                {group.tags.map((tag, i) => (
                  <Text as="span" styleType="label-sm" key={tag} className={tagText()}>
                    {tag}
                    {i !== group.tags.length - 1 && <span>•</span>}
                  </Text>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
