"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./BlogSidebarFilters.module.css";

type BlogSearchProps = {
  initialSearch: string;
  onSubmit: (query: string) => void;
};

const BlogSearch = ({ initialSearch, onSubmit }: BlogSearchProps) => {
  const [value, setValue] = useState(initialSearch);

  useEffect(() => {
    setValue(initialSearch);
  }, [initialSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(value.trim());
  };

  return (
    <div className={`${styles.filterBox} ${styles.mb30}`}>
      <h5 className={styles.sidebarTitle}>Search</h5>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search by title..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Search blogs"
        />
        <button type="submit" className={styles.searchBtn} aria-label="Search">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 17L13.5247 13.5247M15.681 8.3405C15.681 12.3945 12.3945 15.681 8.3405 15.681C4.28645 15.681 1 12.3945 1 8.3405C1 4.28645 4.28645 1 8.3405 1C12.3945 1 15.681 4.28645 15.681 8.3405Z"
              stroke="#560CE3"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default BlogSearch;
