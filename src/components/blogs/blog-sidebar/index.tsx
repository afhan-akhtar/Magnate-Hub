import BlogSearch from "./BlogSearch";
import Category, { type BlogCategoryItem } from "./Category";
import Tags, { type BlogTagRow } from "./Tags";
import RecentPost from "./RecentPost";

export type { BlogCategoryItem, BlogTagRow };

type BlogSidebarProps = {
  searchQuery: string;
  onSearchSubmit: (query: string) => void;
  categories: BlogCategoryItem[];
  tags: BlogTagRow[];
  activeCategoryId: number | null;
  activeTagId: number | null;
  onSelectCategory: (id: number | null) => void;
  onSelectTag: (id: number | null) => void;
};

const BlogSidebar = ({
  searchQuery,
  onSearchSubmit,
  categories,
  tags,
  activeCategoryId,
  activeTagId,
  onSelectCategory,
  onSelectTag,
}: BlogSidebarProps) => {
  return (
    <div className="tg-blog-sidebar top-sticky">
      <BlogSearch initialSearch={searchQuery} onSubmit={onSearchSubmit} />
      <Category
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelect={onSelectCategory}
      />
      <Tags
        tags={tags}
        activeTagId={activeTagId}
        onSelect={onSelectTag}
      />
      <RecentPost />
    </div>
  );
};

export default BlogSidebar;
