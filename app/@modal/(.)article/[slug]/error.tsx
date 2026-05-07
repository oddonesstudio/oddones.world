"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { useEffect, useRef, useState } from "react";

import { ArticleErrorFallback } from "@/app/components/ArticleErrorFallback";

import { Button } from "@/ui/atoms/Button";

type ArticleModalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ArticleModalError({ error }: ArticleModalErrorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const closingToHomeRef = useRef(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  function goHome() {
    closingToHomeRef.current = true;
    setOpen(false);
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          if (closingToHomeRef.current) {
            return;
          }
          router.back();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/10 bg-page-background p-0 shadow-[0_24px_90px_rgba(0,0,0,0.35)] focus:outline-none">
          <Dialog.Title className="sr-only">Article loading error</Dialog.Title>
          <ArticleErrorFallback className="min-h-[420px]" onGoHome={goHome} />
          <Dialog.Close asChild>
            <Button
              variant="ghost"
              className="absolute right-6 top-6 bg-black/10"
              iconOnly={<X className="size-5" aria-hidden="true" />}
              aria-label="Close article modal"
            />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
