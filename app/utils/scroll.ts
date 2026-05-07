export type ScrollRevealState = {
  hidden: boolean;
  scrolled: boolean;
};

type ScrollRevealOptions = {
  hideThreshold?: number;
  scrolledThreshold?: number;
};

export const getScrollRevealState = (
  scrollTop: number,
  previousScrollTop: number,
  options: ScrollRevealOptions = {},
): ScrollRevealState => {
  const { hideThreshold = 100, scrolledThreshold = 8 } = options;

  return {
    hidden: scrollTop > previousScrollTop && scrollTop > hideThreshold,
    scrolled: scrollTop > scrolledThreshold,
  };
};
