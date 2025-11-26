import type { PropsWithChildren } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
  base: `
    mx-auto w-full 
    max-w-container 
    px-container-sm
    md:px-container-md
    lg:px-container-lg
  `,
});

export const Container = ({ children, className }: PropsWithChildren & { className?: string }) => {
  return <div className={styles({ className })}>{children}</div>;
};
