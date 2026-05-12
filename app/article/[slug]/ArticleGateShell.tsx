"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

import { useAppUi } from "@/app/components/AppUiContext";
import { type ArticleGateConfig, ArticleModalGate } from "@/app/components/ArticleModalGate";

import { cn } from "@/ui/_lib/utils";

type ArticleGateShellProps = {
  children: ReactNode;
  gate?: ArticleGateConfig;
};

type GateStatus = "checking" | "locked" | "unlocked";
type GateState = {
  status: GateStatus;
  storageKey?: string;
};

export function ArticleGateShell({ children, gate }: ArticleGateShellProps) {
  const { unlockedArticleStorageKeys } = useAppUi();
  const [gateState, setGateState] = useState<GateState>(() => ({
    status: gate ? "checking" : "unlocked",
    storageKey: gate?.storageKey,
  }));

  useEffect(() => {
    if (!gate) {
      setGateState({ status: "unlocked" });
      return;
    }

    let storedUnlock = false;
    try {
      storedUnlock = localStorage.getItem(gate.storageKey) === "true";
    } catch {
      storedUnlock = false;
    }

    setGateState({
      status:
        storedUnlock || unlockedArticleStorageKeys.has(gate.storageKey) ? "unlocked" : "locked",
      storageKey: gate.storageKey,
    });
  }, [gate, unlockedArticleStorageKeys]);

  const handleGateUnlock = useCallback(() => {
    setGateState((current) => ({ ...current, status: "unlocked" }));
  }, []);
  const gateStatus =
    gate && gate.storageKey !== gateState.storageKey ? "checking" : gateState.status;
  const checking = gateStatus === "checking";
  const locked = gateStatus === "locked";
  const concealed = checking || locked;

  return (
    <div className={cn("relative", concealed && "h-svh overflow-hidden md:h-dvh")}>
      {gate && locked ? (
        <ArticleModalGate
          pixelTitle={gate.pixelTitle}
          storageKey={gate.storageKey}
          title={gate.title}
          onUnlock={handleGateUnlock}
        />
      ) : null}
      <div className={cn(checking && "invisible")}>{children}</div>
    </div>
  );
}
