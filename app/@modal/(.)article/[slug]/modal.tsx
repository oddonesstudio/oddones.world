"use client";

import { LockClosedIcon } from "@radix-ui/react-icons";
import { Maximize2, Minimize2 } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import type { CSSProperties, PointerEvent, UIEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

import { useAppUi } from "@/app/components/AppUiContext";
import { type ArticleGateConfig, ArticleModalGate } from "@/app/components/ArticleModalGate";
import { getArticleShellLayoutId } from "@/app/constants/motion";
import { Z_INDEX_CLASS } from "@/app/constants/ui";
import { getScrollRevealState } from "@/app/utils/scroll";

import { cn, tv } from "@/ui/_lib/utils";
import { Button } from "@/ui/atoms/Button";
import { useMediaQuery } from "@/ui/hooks/useMediaQuery";

const styles = tv({
  slots: {
    articleOverlay: `cursor-zoom-out fixed inset-0 ${Z_INDEX_CLASS.modalOverlay} bg-black/50 backdrop-blur-sm`,
    articleDialog: `fixed left-1/2 top-1/2 ${Z_INDEX_CLASS.modalContent} aspect-[16/9] h-auto w-[90vw] max-w-[1400px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/10 bg-black p-0 shadow-[0_24px_90px_rgba(0,0,0,0.35)] focus:outline-none`,
    articleDrawer: `fixed inset-x-0 bottom-0 ${Z_INDEX_CLASS.modalContent} overflow-hidden rounded-t-[2rem] bg-black p-0 shadow-[0_24px_90px_rgba(0,0,0,0.35)] focus:outline-none`,
    articleShell: "relative h-full overflow-hidden",
    articleControls: `pointer-events-auto right-4 top-4 ${Z_INDEX_CLASS.modalControls} grid size-12 place-items-center gap-4 text-white`,
  },
});

type ModalProps = {
  children: React.ReactNode;
  gate?: ArticleGateConfig;
  slug: string;
};

export function Modal({ children, gate, slug }: ModalProps) {
  const router = useRouter();
  const { logoTabHoverRequestId, setArticleModalState } = useAppUi();
  const isTabletOrMobile = useMediaQuery("(max-width: 1023px)");
  const [expanded, setExpanded] = useState(false);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [drawerHeight, setDrawerHeight] = useState<number | null>(null);
  const [drawerScrollTop, setDrawerScrollTop] = useState(0);
  const [, setDrawerBodyOffset] = useState(0);
  const previousLogoTabHoverRequestId = useRef(logoTabHoverRequestId);
  const previousDrawerScrollRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const handleGateUnlock = useCallback(() => {
    setGateUnlocked(true);
  }, []);

  const { articleControls, articleShell, articleDialog, articleDrawer, articleOverlay } = styles();
  const modalClassName = expanded
    ? cn(
        "fixed inset-0 overflow-hidden rounded-none border-0 bg-black p-0 shadow-none focus:outline-none",
        Z_INDEX_CLASS.fullscreenModal,
      )
    : isTabletOrMobile
      ? articleDrawer()
      : articleDialog();
  const overlayClassName = expanded
    ? cn("fixed inset-0 bg-transparent", Z_INDEX_CLASS.modalOverlay)
    : articleOverlay();
  const modalStyle =
    isTabletOrMobile && !expanded && drawerHeight
      ? ({ height: `${drawerHeight}px` } satisfies CSSProperties)
      : undefined;

  useEffect(() => {
    if (!isTabletOrMobile || expanded) {
      setDrawerHeight(null);
      return;
    }

    setDrawerHeight(Math.round(window.innerHeight * 0.92));
  }, [expanded, isTabletOrMobile]);

  useEffect(() => {
    const scrollY = window.scrollY;
    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;
    const previousBodyStyles = {
      left: bodyStyle.left,
      overflow: bodyStyle.overflow,
      position: bodyStyle.position,
      right: bodyStyle.right,
      top: bodyStyle.top,
      width: bodyStyle.width,
    };
    const previousHtmlOverflow = htmlStyle.overflow;

    htmlStyle.overflow = "hidden";
    bodyStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.left = "0";
    bodyStyle.right = "0";
    bodyStyle.width = "100%";

    return () => {
      htmlStyle.overflow = previousHtmlOverflow;
      bodyStyle.overflow = previousBodyStyles.overflow;
      bodyStyle.position = previousBodyStyles.position;
      bodyStyle.top = previousBodyStyles.top;
      bodyStyle.left = previousBodyStyles.left;
      bodyStyle.right = previousBodyStyles.right;
      bodyStyle.width = previousBodyStyles.width;
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    setArticleModalState({
      expanded,
      navHidden: false,
      open: true,
      scrollTop: 0,
    });

    return () => {
      setArticleModalState({
        expanded: false,
        navHidden: false,
        open: false,
        scrollTop: 0,
      });
    };
  }, [expanded, setArticleModalState]);

  useEffect(() => {
    if (!expanded) return;
    if (previousLogoTabHoverRequestId.current === logoTabHoverRequestId) return;

    previousLogoTabHoverRequestId.current = logoTabHoverRequestId;

    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [expanded, logoTabHoverRequestId]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    const updateDrawerBodyOffset = () => {
      const hero = scrollContainer.querySelector<HTMLElement>('[data-component="Article Hero"]');
      const articleNav = scrollContainer.querySelector<HTMLElement>(
        'nav[aria-label="Article sections"]',
      );

      setDrawerBodyOffset(
        articleNav?.offsetTop ?? hero?.offsetHeight ?? scrollContainer.clientHeight,
      );
    };

    updateDrawerBodyOffset();

    const resizeObserver = new ResizeObserver(updateDrawerBodyOffset);
    resizeObserver.observe(scrollContainer);

    return () => resizeObserver.disconnect();
  }, []);

  function onArticleScroll(event: UIEvent<HTMLDivElement>) {
    const scrollTop = event.currentTarget.scrollTop;
    const revealState = getScrollRevealState(scrollTop, previousDrawerScrollRef.current);

    setDrawerScrollTop(scrollTop);
    setArticleModalState({
      navHidden: revealState.hidden,
      scrollTop,
    });
    previousDrawerScrollRef.current = scrollTop;
  }

  function onDismiss() {
    router.back();
  }

  function stopDrawerControlPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  function onExpand() {
    setExpanded(true);
  }

  function onMinimize() {
    setExpanded(false);
  }

  const drawerHandleOverBody =
    drawerScrollTop >= (scrollContainerRef.current?.clientHeight ?? Number.POSITIVE_INFINITY);

  const articleControlsElement = (
    <motion.div
      className={cn(articleControls(), expanded ? "fixed" : "absolute")}
      onPointerDown={stopDrawerControlPointerDown}
    >
      {gate && !gateUnlocked ? (
        <LockClosedIcon className="size-5 transition-transform group-hover:scale-110" />
      ) : (
        <Button
          variant="ghost"
          className="bg-black/60"
          iconOnly={
            expanded ? (
              <Minimize2 className="size-5 transition-transform hover:scale-110" />
            ) : (
              <Maximize2 className="size-5 transition-transform hover:scale-110" />
            )
          }
          aria-label={
            expanded ? "Minimize article to modal preview" : "Expand article modal to full screen"
          }
          onClick={expanded ? onMinimize : onExpand}
        />
      )}
    </motion.div>
  );

  const articleContent = (
    <>
      <motion.div
        className={articleShell()}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {gate && !gateUnlocked ? (
          <ArticleModalGate
            pixelTitle={gate.pixelTitle}
            storageKey={gate.storageKey}
            title={gate.title}
            onUnlock={handleGateUnlock}
          />
        ) : null}
        <div
          ref={scrollContainerRef}
          className={
            gate && !gateUnlocked ? "h-full overflow-hidden bg-black" : "h-full overflow-y-auto"
          }
          onScroll={onArticleScroll}
        >
          {children}
        </div>
      </motion.div>
      {!expanded ? articleControlsElement : null}
    </>
  );

  if (isTabletOrMobile && !expanded) {
    return (
      <Drawer.Root
        fixed
        modal
        open
        preventScrollRestoration
        repositionInputs={false}
        onOpenChange={(open) => {
          if (!open) {
            onDismiss();
          }
        }}
      >
        <Drawer.Portal>
          <Drawer.Overlay className={overlayClassName} />
          <Drawer.Content asChild>
            <motion.div
              className={modalClassName}
              layout
              layoutId={getArticleShellLayoutId(slug)}
              style={modalStyle}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <Drawer.Title className="sr-only">Article preview</Drawer.Title>
              <Drawer.Description className="sr-only">Article modal</Drawer.Description>
              <motion.div
                className={cn(
                  Z_INDEX_CLASS.modalOverlay,
                  "absolute inset-x-0 top-0 flex h-editorial items-start justify-center",
                  // drawerHandleOverBody && "bg-white",
                )}
                animate={{
                  backgroundColor: drawerHandleOverBody
                    ? "rgba(255, 255, 255, 1)"
                    : "rgba(255, 255, 255, 0)",
                  // boxShadow: drawerHandleOverBody
                  //   ? "0 1px 0 rgba(0, 0, 0, 0.08)"
                  //   : "0 1px 0 rgba(0, 0, 0, 0)",
                }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              >
                <Drawer.Handle className="top-4 pointer-events-auto cursor-grab active:cursor-grabbing" />
              </motion.div>
              {articleContent}
            </motion.div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog.Root
      modal={!expanded}
      open
      onOpenChange={(open) => {
        if (!open) {
          onDismiss();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={overlayClassName} />
        <Dialog.Content asChild>
          <motion.div
            className={modalClassName}
            layout
            layoutId={getArticleShellLayoutId(slug)}
            style={modalStyle}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <Dialog.Title className="sr-only">
              {expanded ? "Article" : "Article preview"}
            </Dialog.Title>
            <Dialog.Description className="sr-only">Article modal</Dialog.Description>
            {articleContent}
          </motion.div>
        </Dialog.Content>
        {expanded ? articleControlsElement : null}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
