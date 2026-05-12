"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";

import { Z_INDEX_CLASS } from "@/app/constants/ui";

const modalDismissTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
} as const;

export function ModalSlotPresence({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const modalSegment = useSelectedLayoutSegment("modal");

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {modalSegment ? (
        <motion.div
          key={pathname}
          className={`${Z_INDEX_CLASS.modalSlot} pointer-events-none fixed inset-0`}
          exit={{ opacity: 0.999 }}
          transition={modalDismissTransition}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
