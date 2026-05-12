import { Z_INDEX_CLASS } from "@/app/constants/ui";
import { Container } from "@/ui/global/Container";

type ArticleLoadingFallbackProps = {
  className?: string;
  variant?: "page" | "modal";
};

export function ArticleLoadingFallback({
  className = "",
  variant = "page",
}: ArticleLoadingFallbackProps) {
  const heroHeight = variant === "modal" ? "min-h-[520px]" : "min-h-screen";

  return (
    <article
      aria-busy="true"
      aria-label="Loading article"
      className={`relative flex min-h-full flex-col items-stretch bg-page-background text-black ${className}`}
    >
      <section
        className={`relative flex ${heroHeight} w-full items-center justify-center overflow-hidden bg-black`}
      >
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.18),rgba(255,255,255,0.06))]" />
        <div
          className={`${Z_INDEX_CLASS.local} relative flex w-full max-w-3xl flex-col items-center gap-5 px-6 text-center`}
        >
          <div className="h-3 w-40 rounded-full bg-white/25" />
          <div className="h-10 w-full max-w-2xl rounded-full bg-white/35" />
          <div className="h-10 w-3/4 max-w-xl rounded-full bg-white/25" />
          <div className="mt-2 h-4 w-full max-w-lg rounded-full bg-white/20" />
          <div className="h-4 w-2/3 max-w-md rounded-full bg-white/15" />
        </div>
      </section>
      <div
        className={`${Z_INDEX_CLASS.localOverlay} w-full rounded-lg bg-white pb-(--footer-height)`}
      >
        <Container className="flex flex-col gap-20">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-[30%_70%]">
            <aside className="hidden flex-col gap-8 md:flex">
              <div className="h-28 rounded-lg bg-black/10" />
              <div className="h-48 rounded-lg bg-black/10" />
            </aside>
            <div className="flex flex-col gap-4">
              <span className="sr-only">Article content is loading</span>
              <div className="h-5 w-full rounded-full bg-black/10" />
              <div className="h-5 w-11/12 rounded-full bg-black/10" />
              <div className="h-5 w-10/12 rounded-full bg-black/10" />
              <div className="mt-6 h-5 w-full rounded-full bg-black/10" />
              <div className="h-5 w-9/12 rounded-full bg-black/10" />
            </div>
          </div>
        </Container>
      </div>
    </article>
  );
}
