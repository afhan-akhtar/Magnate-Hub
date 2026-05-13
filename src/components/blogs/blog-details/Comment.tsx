"use client";

import React from "react";
import styles from "./Comment.module.css";

type CommentItem = {
  comment_id?: number | string;
  name?: string;
  message?: string;
  created_at?: string;
};

type CommentPropsType = {
  blogCommetData: CommentItem[];
};

const Comment = ({ blogCommetData }: CommentPropsType) => {
  if (!blogCommetData || blogCommetData.length === 0) {
    return (
      <div className={styles.emptyState}>
        No comments yet. Be the first to share your thoughts.
      </div>
    );
  }

  return (
    <div className={styles.commentList}>
      {blogCommetData.map((item, idx) => {
        const key = item.comment_id ?? idx;
        const authorName = item.name || "Anonymous";
        const initial =
          authorName && authorName.trim().length > 0
            ? authorName.trim().charAt(0).toUpperCase()
            : "?";

        return (
          <article key={key} className={styles.commentCard}>
            <div className={styles.avatar}>
              <span className={styles.avatarInitial}>{initial}</span>
            </div>

            <div className={styles.commentContent}>
              <div className={styles.commentHeader}>
                <div className={styles.authorInfo}>
                  <span className={styles.authorLabel}>Author</span>
                  <h6 className={styles.authorName}>{authorName}</h6>
                </div>

                {item.created_at && (
                  <span className={styles.commentDate}>{item.created_at}</span>
                )}
              </div>

              <p className={styles.commentText}>{item.message}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default Comment;
