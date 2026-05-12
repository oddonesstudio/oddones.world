"use client";

import { EyeOff } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import { Z_INDEX_CLASS } from "@/app/constants/ui";

export function SanityPreviewExit() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const currentPath = `${pathname}${queryString ? `?${queryString}` : ""}`;
  const exitUrl = `/api/disable-draft?redirect=${encodeURIComponent(currentPath)}`;

  return (
    <div
      className={`${Z_INDEX_CLASS.previewBanner} fixed top-4 left-1/2 flex -translate-x-1/2 items-center gap-3 border-2 border-black bg-page-background px-4 py-3 text-page-foreground shadow-custom`}
    >
      <span className="font-mono text-xs uppercase tracking-normal">Sanity preview enabled</span>
      <a
        className="inline-flex items-center gap-2 border-2 border-black bg-page-foreground px-3 py-2 font-mono text-xs uppercase tracking-normal text-page-background transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page-foreground"
        href={exitUrl}
      >
        <EyeOff aria-hidden="true" size={14} strokeWidth={2.5} />
        Exit preview
      </a>
    </div>
  );
}
