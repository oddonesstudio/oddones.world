"use client";

import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import { type ArticleGateConfig, ArticleModalGate } from "@/app/components/ArticleModalGate";

import { cn } from "@/ui/_lib/utils";

type ArticleGateShellProps = {
  children: ReactNode;
  gate?: ArticleGateConfig;
};

export function ArticleGateShell({ children, gate }: ArticleGateShellProps) {
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const handleGateUnlock = useCallback(() => {
    setGateUnlocked(true);
  }, []);
  const locked = Boolean(gate && !gateUnlocked);

  return (
    <div className={cn("relative", locked && "h-dvh overflow-hidden")}>
      {gate ? (
        <ArticleModalGate
          pixelTitle={gate.pixelTitle}
          storageKey={gate.storageKey}
          title={gate.title}
          onUnlock={handleGateUnlock}
        />
      ) : null}
      {children}
    </div>
  );
}
