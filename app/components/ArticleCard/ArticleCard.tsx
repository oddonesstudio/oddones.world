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
    <div className="rounded-lg overflow-clip relative hover:-translate-y-1 w-[300px]">
      {image && (
        <div className="aspect-square">
          <Image src={image} alt={""} fill objectFit="cover" />
        </div>
      )}
      {/* <div>
        {title && <h3>{title}</h3>}
        {excerpt && <p>{excerpt}</p>}
        {slug && (
          <Link className="cursor-pointer before:absolute before:inset-0" href={`/blog/${slug}`}>
            Read
          </Link>
        )}
      </div> */}
    </div>
  );
};
