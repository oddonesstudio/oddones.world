import { SectionHeader } from "../SectionHeader";

type HomeHeroProps = {
  heading: string | null;
  intro: string | null;
};

export const HomeHero = (props: HomeHeroProps) => {
  return (
    <section
      className="relative flex flex-col gap-20 bg-foreground w-full h-[80vh] justify-center rounded-3xl"
      data-component="HomeHero"
    >
      <SectionHeader heading={props.heading || "Odd Ones"} intro={props.intro} />
    </section>
  );
};
