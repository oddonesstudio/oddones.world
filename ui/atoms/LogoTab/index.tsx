import Link from "next/link";

import { tv } from "@/ui/_lib/utils";

import { Logo } from "../../_assets/Logo";

const styles = tv({
  slots: {
    base: "flex items-end h-header w-fit bg-black p-8 cursor-pointer",
  },
});

interface LogoTabProps {
  className?: string;
  onHover?: () => void;
}

export const LogoTab = ({ className, onHover }: LogoTabProps) => {
  const { base } = styles();

  const handleMouseEnter = () => {
    onHover?.();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link href="/" className={base({ className })} onMouseEnter={handleMouseEnter}>
      <Logo framed />
    </Link>
  );
};
