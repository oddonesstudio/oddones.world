const revealTransition = {
  duration: 0.62,
  ease: [0.16, 1, 0.3, 1],
} as const;

const cardSpringTransition = {
  type: "spring",
  stiffness: 150,
  damping: 28,
  mass: 1,
} as const;

export const cardVariants = {
  hidden: {
    scale: 0.96,
    transition: cardSpringTransition,
  },
  revealed: {
    scale: 1,
    transition: cardSpringTransition,
  },
} as const;

export const overlayVariants = {
  hidden: { opacity: 0.28, transition: revealTransition },
  revealed: { opacity: 0.78, transition: revealTransition },
} as const;

export const textContainerVariants = {
  hidden: {
    y: 24,
    opacity: 0,
    transition: { ...revealTransition, staggerChildren: 0.025, staggerDirection: -1 },
  },
  revealed: {
    y: 0,
    opacity: 1,
    transition: { ...revealTransition, delayChildren: 0.08, staggerChildren: 0.055 },
  },
} as const;

export const textItemVariants = {
  hidden: { y: 8, opacity: 0, transition: revealTransition },
  revealed: { y: 0, opacity: 1, transition: revealTransition },
} as const;

export const iconVariants = {
  hidden: { y: -8, scale: 0.96, opacity: 0, transition: revealTransition },
  revealed: { y: 0, scale: 1, opacity: 1, transition: { ...revealTransition, delay: 0.14 } },
} as const;
