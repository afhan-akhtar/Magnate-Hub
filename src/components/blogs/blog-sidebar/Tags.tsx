"use client";

import { useState } from "react";
import styles from "./BlogSidebarFilters.module.css";

export type BlogTagRow = {
  id: number;
  name: string;
  slug?: string;
};

type TagsProps = {
  tags: BlogTagRow[];
  activeTagId: number | null;
  onSelect: (id: number | null) => void;
};

const VISIBLE_TAG_LIMIT = 10;

const Tags = ({ tags, activeTagId, onSelect }: TagsProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const activeTagIndex = tags.findIndex((tag) => tag.id === activeTagId);
  const shouldShowAllTags =
    showAllTags || activeTagIndex >= VISIBLE_TAG_LIMIT;
  const visibleTags = shouldShowAllTags
    ? tags
    : tags.slice(0, VISIBLE_TAG_LIMIT);
  const canShowMore = tags.length > VISIBLE_TAG_LIMIT && !shouldShowAllTags;

  return (
    <div className={`${styles.filterBox} ${styles.mb30}`}>
      <h5 className={styles.sidebarTitle}>Tags</h5>
      {tags.length === 0 ? (
        <p className={styles.emptyHint}>No tags yet.</p>
      ) : (
        <div className={styles.tagCloud}>
          <button
            type="button"
            className={`${styles.tagPill} ${
              activeTagId === null ? styles.tagPillActive : ""
            }`}
            onClick={() => onSelect(null)}
          >
            All
          </button>
          {visibleTags.map((tag) => {
            const isActive = activeTagId === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                className={`${styles.tagPill} ${
                  isActive ? styles.tagPillActive : ""
                }`}
                onClick={() => onSelect(tag.id)}
              >
                {tag.name}
              </button>
            );
          })}
          {canShowMore && (
            <button
              type="button"
              className={styles.showMoreButton}
              onClick={() => setShowAllTags(true)}
            >
              Show more
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Tags;
