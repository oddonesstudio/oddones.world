"use client";

import Link from "next/link";

import { Logo } from "./Logo";

interface LogoTabProps {
  className?: string;
  onHover?: () => void;
}

export const LogoTab = ({ className, onHover }: LogoTabProps) => (
  <Link
    href="/"
    className={className}
    onMouseEnter={onHover}
    onFocus={onHover}
    aria-label="Home"
  >
    <Logo framed />
  </Link>
);
