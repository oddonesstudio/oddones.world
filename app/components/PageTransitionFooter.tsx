"use client";

import { usePathname } from "next/navigation";
import { WavyFooter } from "./WavyFooter";

export const PageTransitionFooter = () => {
  const pathname = usePathname();

  return <WavyFooter pathname={pathname} />;
};
