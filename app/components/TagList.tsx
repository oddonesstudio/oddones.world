interface TagGroup {
  emoji?: string;
  tags?: string[];
}

interface TagGroupSection {
  heading?: string;
  groups?: TagGroup[];
}

interface TagListProps {
  sections: TagGroupSection[];
}

export const TagList = (props: TagListProps) => {
  return (
    <div className="flex flex-col gap-10">
      {props.sections.map((section, i) => (
        <div key={i} className="flex flex-col gap-2">
          {section.heading ? <h3 className="text-white flex">{section.heading}</h3> : null}
          {(section.groups ?? []).map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-wrap gap-2">
              {group.emoji ? <span>{group.emoji}</span> : null}
              {(group.tags ?? []).map((tag, tagIndex) => (
                <span key={tagIndex} className="bg-white p-1 uppercase">
                  {tag}
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
