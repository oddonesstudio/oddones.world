import { ArticleErrorFallback } from "@/app/components/ArticleErrorFallback";

export default function NotFound() {
  return (
    <ArticleErrorFallback className="min-h-screen pt-(--header-height) pb-(--footer-height)" />
  );
}
