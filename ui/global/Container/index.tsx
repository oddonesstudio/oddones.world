import type { PropsWithChildren, Ref } from "react";

import { tv } from "@/ui/_lib/utils";

const styles = tv({
  slots: {
    base: "mx-auto w-full max-w-page",
  },
  variants: {
    width: {
      default: "px-left-right pt-top-bottom pb-[calc(var(--top-bottom)/2)]",
      editorial: "p-editorial",
    },
  },
});

export const Container = ({
  id,
  ref,
  children,
  className,
  width = "default",
}: PropsWithChildren & {
  id?: string;
  ref?: Ref<HTMLElement>;
  className?: string;
  width?: "default" | "editorial";
}) => {
  const { base } = styles({ width });

  return (
    <section id={id} ref={ref} className={base({ className })}>
      {children}
    </section>
  );
};
