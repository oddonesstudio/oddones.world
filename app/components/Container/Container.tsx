import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/app/utils/cn";

const containerStyles = tv({
  base: "w-full mx-auto",
  variants: {
    variant: {
      default: "px-6",
      editorial: "max-w-[1280px] px-[clamp(1rem,5vw,80px)]",
      prose: "max-w-[65ch] px-[clamp(1rem,4vw,40px)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof containerStyles>;

export function Container({ variant, className, children, ...props }: ContainerProps) {
  return (
    <div className={cn(containerStyles({ variant }), className)} {...props}>
      {children}
    </div>
  );
}
