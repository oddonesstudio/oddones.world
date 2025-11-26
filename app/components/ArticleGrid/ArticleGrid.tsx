import { ArticleCard, type ArticleCardProps } from "../ArticleCard/ArticleCard";

interface ArticleGridProps {
  articles?: (ArticleCardProps & { _key?: string })[];
}

export const ArticleGrid = ({ articles }: ArticleGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {articles?.map((article, idx) => {
        const { _key, ...cardProps } = article;

        return <ArticleCard key={_key ?? cardProps.slug ?? idx} {...cardProps} />;
      })}
    </div>
  );
};
