import type { PropsWithChildren } from "react";

import { cn } from "@/app/utils/cn";

interface StackedSectionsProps extends PropsWithChildren {
  className?: string;
}

interface StackedSectionProps extends PropsWithChildren {
  index: number;
  className?: string;
  sticky?: boolean;
}

export const StackedSections = ({ className, children }: StackedSectionsProps) => {
  return <div className={cn("relative flex flex-col gap-16 pb-24", className)}>{children}</div>;
};

export const StackedSection = ({
  index,
  className,
  sticky = true,
  children,
}: StackedSectionProps) => {
  return (
    <section className={cn(sticky ? "sticky top-6" : "relative", className)} style={{ zIndex: index + 1 }}>
      {children}
    </section>
  );
};
