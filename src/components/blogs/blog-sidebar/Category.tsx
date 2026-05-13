"use client";

import styles from "./BlogSidebarFilters.module.css";

export type BlogCategoryItem = {
  id: number;
  name: string;
  blogs_count?: number;
  count?: number;
};

type CategoryProps = {
  categories: BlogCategoryItem[];
  activeCategoryId: number | null;
  onSelect: (id: number | null) => void;
};

const Category = ({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryProps) => {
  return (
    <div className={`${styles.filterBox} ${styles.mb30}`}>
      <h5 className={styles.sidebarTitle}>Categories</h5>
      {categories.length === 0 ? (
        <p className={styles.emptyHint}>No categories yet.</p>
      ) : (
        <ul className={styles.categoryList}>
          <li>
            <button
              type="button"
              className={`${styles.categoryRow} ${
                activeCategoryId === null ? styles.categoryRowActive : ""
              }`}
              onClick={() => onSelect(null)}
            >
              <span className={styles.categoryName}>All</span>
            </button>
          </li>
          {categories.map((item) => {
            const count = item.blogs_count ?? item.count;
            const isActive = activeCategoryId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`${styles.categoryRow} ${
                    isActive ? styles.categoryRowActive : ""
                  }`}
                  onClick={() => onSelect(item.id)}
                >
                  <span className={styles.categoryName}>{item.name}</span>
                  {typeof count === "number" && (
                    <span className={styles.categoryCount}>({count})</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Category;
