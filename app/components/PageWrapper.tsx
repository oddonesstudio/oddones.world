"use client";

import { motion } from "motion/react";

import type { PropsWithChildren } from "react";

import { getArticleShellLayoutId } from "../constants/motion";

interface PageWrapperProps extends PropsWithChildren {
  slug: string;
}

export const PageWrapper = ({ children, slug }: PageWrapperProps) => {
  return (
    <motion.section layoutId={getArticleShellLayoutId(slug)} data-component="Page Wrapper">
      {children}
    </motion.section>
  );
};
