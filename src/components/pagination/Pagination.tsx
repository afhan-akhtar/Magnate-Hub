import React from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;     
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages: number[] = [];
  const pageRange = 2; 

  const start = Math.max(1, currentPage - pageRange);
  const end = Math.min(totalPages, currentPage + pageRange);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className={styles.pagination}>
      <button
        className={styles.navBtn}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={styles.pageBtn}
          >
            1
          </button>
          <span className={styles.dots}>...</span>
        </>
      )}

      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`${styles.pageBtn} ${
            num === currentPage ? styles.active : ""
          }`}
          aria-label={`Page ${num}`}
          aria-current={num === currentPage ? "page" : undefined}
        >
          {num}
        </button>
      ))}

      {end < totalPages && (
        <>
          <span className={styles.dots}>...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className={styles.pageBtn}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className={styles.navBtn}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </nav>
  );
};

export default Pagination;
