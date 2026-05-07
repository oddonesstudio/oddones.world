"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Image from "next/image";
import { Accordion as RadixAccordion } from "radix-ui";
import { useEffect, useState } from "react";

import type { AccordionItem as AccordionItemType, PortableTextValue } from "@/app/types/sanity";

import { cn } from "@/ui/_lib/utils";
import { Text } from "@/ui/atoms/Text";
import { PortableTextRenderer } from "@/ui/global/PortableTextRenderer/PortableTextRenderer";

interface AccordionProps {
  heading?: string;
  headingId?: string;
  summaryText?: PortableTextValue;
  items: AccordionItemType[];
}

const IMAGE_CLOSE_DURATION = 320;
const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
const LAYOUT_TRANSITION = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1],
} as const;

const mobileImageVariants: Variants = {
  closed: {
    width: 70,
    height: 70,
    scale: 0.92,
  },
  open: {
    width: "100%",
    height: "auto",
    scale: 1,
  },
};

const desktopImageVariants: Variants = {
  closed: {
    width: 70,
    height: 70,
    scale: 0.92,
  },
  open: {
    width: "min(28vw, 220px)",
    height: "min(28vw, 220px)",
    scale: 1,
  },
};

const mobileItemVariants: Variants = {
  closed: {
    gridTemplateColumns: "70px 1fr",
  },
  open: {
    gridTemplateColumns: "1fr",
  },
};

const desktopItemVariants: Variants = {
  closed: {
    gridTemplateColumns: "70px 1fr",
  },
  open: {
    gridTemplateColumns: "min(28vw, 220px) 1fr",
  },
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  return isMobile;
};

const contentVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
  },
  open: {
    height: "auto",
    opacity: 1,
  },
};

const contentInnerVariants: Variants = {
  closed: {
    y: -8,
    opacity: 0,
  },
  open: {
    y: 0,
    opacity: 1,
  },
};

const chevronVariants: Variants = {
  closed: {
    rotate: 0,
  },
  open: {
    rotate: 180,
  },
};

export const Accordion = ({ heading, headingId, summaryText, items }: AccordionProps) => {
  const [openItem, setOpenItem] = useState<string | undefined>(items[0]?._key);
  const [closingItem, setClosingItem] = useState<string | undefined>();

  if (items.length === 0) {
    return null;
  }

  const handleValueChange = (value: string) => {
    const nextValue = value || undefined;

    if (!nextValue && openItem) {
      setClosingItem(openItem);
      return;
    }

    setClosingItem(undefined);
    setOpenItem(nextValue);
  };

  return (
    <RadixAccordion.Root
      type="single"
      value={openItem}
      onValueChange={handleValueChange}
      collapsible
    >
      {heading && (
        <Text
          as="h2"
          id={headingId}
          styleType="heading-lg"
          className="mt-10 mb-6 scroll-mt-editorial"
        >
          {heading}
        </Text>
      )}
      {summaryText && <PortableTextRenderer value={summaryText} />}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <AccordionItem
            key={item._key}
            item={item}
            isClosing={closingItem === item._key}
            isOpen={openItem === item._key}
            onCloseImageComplete={() => {
              if (closingItem === item._key) {
                setOpenItem(undefined);
                setClosingItem(undefined);
              }
            }}
          />
        ))}
      </div>
    </RadixAccordion.Root>
  );
};

const AccordionItem = ({
  item,
  isClosing,
  isOpen,
  onCloseImageComplete,
}: {
  item: AccordionItemType;
  isClosing: boolean;
  isOpen: boolean;
  onCloseImageComplete: () => void;
}) => {
  const [isLayoutOpen, setIsLayoutOpen] = useState(isOpen);
  const isMobile = useIsMobile();
  const imageUrl = item.image?.asset?.url;

  useEffect(() => {
    if (isOpen) {
      setIsLayoutOpen(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isClosing) {
      return;
    }

    const timeoutId = window.setTimeout(onCloseImageComplete, IMAGE_CLOSE_DURATION);

    return () => window.clearTimeout(timeoutId);
  }, [isClosing, onCloseImageComplete]);

  return (
    <RadixAccordion.Item value={item._key} asChild>
      <motion.div
        className="grid gap-4 py-4 md:gap-x-8"
        animate={isLayoutOpen && imageUrl ? "open" : "closed"}
        variants={isMobile ? mobileItemVariants : desktopItemVariants}
        transition={LAYOUT_TRANSITION}
      >
        <div className="row-span-2">
          {imageUrl && (
            <motion.div
              animate={isOpen && !isClosing ? "open" : "closed"}
              className="overflow-hidden bg-black/5"
              variants={isMobile ? mobileImageVariants : desktopImageVariants}
              transition={LAYOUT_TRANSITION}
            >
              <Image
                src={imageUrl}
                alt={item.title ?? ""}
                width={220}
                height={220}
                className="h-full w-full object-contain"
              />
            </motion.div>
          )}
        </div>
        <RadixAccordion.Header
          className={cn("flex items-center justify-between", !isLayoutOpen && "row-span-2")}
        >
          <RadixAccordion.Trigger className="group flex justify-between w-full items-center gap-2 text-left text-lg font-medium cursor-pointer">
            <span>{item.title}</span>
            <motion.span
              animate={isOpen && !isClosing ? "open" : "closed"}
              className="shrink-0"
              variants={chevronVariants}
              transition={LAYOUT_TRANSITION}
            >
              <ChevronDown className="size-7 md:size-6" />
            </motion.span>
          </RadixAccordion.Trigger>
        </RadixAccordion.Header>
        <AnimatePresence
          initial={false}
          onExitComplete={() => {
            if (!isOpen) {
              setIsLayoutOpen(false);
            }
          }}
        >
          {isOpen && (
            <RadixAccordion.Content forceMount asChild>
              <motion.div
                className="overflow-hidden"
                initial="closed"
                animate="open"
                exit="closed"
                variants={contentVariants}
                transition={LAYOUT_TRANSITION}
              >
                <motion.div
                  className="pb-4"
                  variants={contentInnerVariants}
                  transition={LAYOUT_TRANSITION}
                >
                  <PortableTextRenderer value={item.content} />
                </motion.div>
              </motion.div>
            </RadixAccordion.Content>
          )}
        </AnimatePresence>
      </motion.div>
    </RadixAccordion.Item>
  );
};
