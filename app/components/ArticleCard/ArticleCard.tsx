import Image from "next/image";
import Link from "next/link";

export interface ArticleCardProps {
  slug?: string;
  title?: string;
  excerpt?: string;
  image?: string;
}

export const ArticleCard = ({ slug, title, excerpt, image }: ArticleCardProps) => {
  return (
    <div className="flex flex-col gap-4">
      {image && (
        <div className="relative w-full aspect-3/2">
          <Image src={image} alt={""} fill />
        </div>
      )}
      {title && <h3>{title}</h3>}
      {excerpt && <p>{excerpt}</p>}
      {slug && (
        <Link className="cursor-pointer" href={`/blog/${slug}`}>
          Read
        </Link>
      )}
    </div>
  );
};
