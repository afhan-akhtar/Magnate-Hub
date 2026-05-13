"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/api/axiosInstance";
import { useBlogSidebarProps } from "../blog-sidebar/useBlogSidebarProps";
import Image from "next/image";
import Link from "next/link";
import BlogSidebar from "../blog-sidebar";
import Button from "@/components/common/Button";
import Loading from "@/components/loading/Loading";
import Pagination from "@/components/pagination/Pagination";
import styles from "./BlogArea.module.css";

type BlogTagItem = { id: number; name: string; slug?: string };

 interface BlogListItem {
  id: number;
  name: string;
  url: string;
  description: string;
  writer_name?: string;
  writter_name?: string;
  date?: string;
  time?: string;
  image?: string | null;
  title_image?: string | null;
  images?: string[];
  category?: string | { id?: number; name?: string } | null;
  tags?: BlogTagItem[];
  /** Legacy field name used in older UI */
  card?: string;
}
interface LocalPagination {
  totalPage: number;
  currentPage: number;
  perPage: number;
  total: number;
  nextPageUrl?: string | null;
  prevPageUrl?: string | null;
}

const BlogArea = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const searchQuery = searchParams.get("search")?.trim() || "";
  const categoryIdParam = searchParams.get("category_id");
  const tagIdParam = searchParams.get("tag_id");

  const [blogLoading, setBlogLoading] = useState<boolean>(true);
  const [blogData, setBlogData] = useState<BlogListItem[]>([]);
  const [localPagination, setLocalPagination] = useState<LocalPagination>({
    totalPage: 1,
    currentPage: 1,
    perPage: 12,
    total: 0,
  });
  const sidebarProps = useBlogSidebarProps();

  const pushQuery = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(searchParams.toString());
      mutate(p);
      router.push(`${pathname}?${p.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const getBlogs = useCallback(async () => {
    try {
      setBlogLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (searchQuery) params.set("search", searchQuery);
      if (categoryIdParam) params.set("category_id", categoryIdParam);
      if (tagIdParam) params.set("tag_id", tagIdParam);

      const response = await apiRequest({
        url: `blogs?${params.toString()}`,
        method: "GET",
      });
  
      const paginator = response?.data;
      const rows = response?.data?.data || [];

      setBlogData(rows);
      setLocalPagination({
        totalPage: paginator?.last_page || 1,
        currentPage: paginator?.current_page || page,
        perPage: paginator?.per_page || 12,
        total: paginator?.total ?? rows.length,
        nextPageUrl: paginator?.next_page_url,
        prevPageUrl: paginator?.prev_page_url,
      });
    } catch {
      setBlogData([]);
      setLocalPagination((prev) => ({
        ...prev,
        totalPage: 1,
        currentPage: 1,
        total: 0,
      }));
    } finally {
      setBlogLoading(false);
    }
  }, [page, searchQuery, categoryIdParam, tagIdParam]);

  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  const redirectToBlogDetail = (item: BlogListItem) => {
    router.push(`/blog-details?url=${item.url}&id=${item.id}`);
  };

  const handlePageChange = (pageNumber: number) => {
    pushQuery((p) => {
      p.set("page", String(Math.max(1, pageNumber)));
    });
  };

  const getLimitedHtml = (html: string, limit: number) => {
    const stripped = html.replace(/<[^>]+>/g, "");
    let limited = stripped.substring(0, limit);
    if (stripped.length > limit) {
      limited += "...";
    }
    return limited;
  };

  const totalPages = localPagination?.totalPage || 1;

  return (
    <div className={styles.blogGridArea}>
      <div className="container">
        <div className="row">
          {blogLoading ? (
            <div className="col-xl-9 col-lg-8">
              <div className={styles.loadingWrapper}>
                <Loading />
              </div>
            </div>
          ) : (
            <div className="col-xl-9 col-lg-8">
              <div className={styles.blogGridWrap}>
                <div className="row">
                  {blogData.length === 0 ? (
                    <div className="col-12">
                      <p className={styles.emptyList}>
                        No blogs match your filters. Try adjusting search,
                        category, or tags.
                      </p>
                    </div>
                  ) : (
                    blogData.map((item) => {
                      const imgSrc = String(item.title_image);
                      const tagList = Array.isArray(item.tags) ? item.tags : [];
                      const writer = item.writer_name ?? item.writter_name ?? "";
                      const categoryLabel =
                        typeof item.category === "string"
                          ? item.category
                          : item.category?.name ?? "";

                      return (
                        <div
                          key={item.id}
                          className={`col-xl-6 mb-30 col-lg-12 col-md-6 ${styles.cardCol}`}
                        >
                          <article className={styles.blogCard}>
                            <div
                              className={styles.thumbWrapper}
                              onClick={() => redirectToBlogDetail(item)}
                            >
                              <div className={styles.thumbInner}>
                                <Image
                                  className={styles.cardImage}
                                  width={400}
                                  height={260}
                                  src={imgSrc}
                                  alt={item.name}
                                  unoptimized
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/assets/img/notfound/image_notfound.png";
                                  }}
                                />
                              </div>
                              <div className={styles.thumbOverlay} />
                            </div>

                            <div className={styles.cardContent}>
                              {(categoryLabel || tagList.length > 0) && (
                                <div className={styles.cardTaxonomy}>
                                  {categoryLabel && (
                                    <span className={styles.categoryBadge}>
                                      {categoryLabel}
                                    </span>
                                  )}
                                  {tagList.map((tg) => (
                                    <span
                                      key={tg.id}
                                      className={styles.tagChip}
                                    >
                                      {tg.name}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <h2
                                className={styles.cardTitle}
                                onClick={() => redirectToBlogDetail(item)}
                              >
                                {item.name.length > 70
                                  ? item.name.slice(0, 70) + "..."
                                  : item.name}
                              </h2>

                              {(writer || item.date || item.time) && (
                                <div className={styles.metaRow}>
                                  {writer && (
                                    <span className={styles.metaItem}>
                                      <span className={styles.metaIcon}>
                                        <svg
                                          width="16"
                                          height="16"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M1.51089 15.2889C1.33312 15.2889 1.15534 15.2 1.06645 15.1111C0.977561 14.9334 0.888672 14.8445 0.888672 14.6667C0.888672 13.4222 1.24423 12.1778 1.86645 11.0222C2.48867 9.95558 3.46645 8.9778 4.53312 8.35558C4.08867 7.82225 3.73312 7.11114 3.55534 6.40003C3.46645 5.68892 3.46645 4.88892 3.64423 4.26669C3.82201 3.55558 4.26645 2.84447 4.71089 2.31114C5.24423 1.7778 5.86645 1.33336 6.48867 1.15558C7.02201 0.977805 7.55534 0.888916 8.08867 0.888916C8.26645 0.888916 8.53312 0.888916 8.71089 0.888916C9.42201 0.977805 10.1331 1.24447 10.7553 1.68892C11.3776 2.13336 11.822 2.66669 12.1776 3.28892C12.5331 3.91114 12.7109 4.62225 12.7109 5.42225C12.7109 6.48892 12.3553 7.55558 11.6442 8.35558C12.1776 8.71114 12.7109 9.06669 13.2442 9.51114C13.9553 10.2222 14.3998 10.9334 14.8442 11.8222C15.1998 12.7111 15.3776 13.6 15.3776 14.5778C15.3776 14.7556 15.2887 14.9334 15.1998 15.0222C15.1109 15.1111 14.9331 15.2 14.7553 15.2C14.6665 15.2 14.5776 15.2 14.4887 15.1111C14.3998 15.1111 14.3109 15.0222 14.3109 14.9334C14.222 14.8445 14.222 14.8445 14.1331 14.7556C14.1331 14.6667 14.0442 14.5778 14.0442 14.4889C14.0442 13.6889 13.8664 12.9778 13.5998 12.2667C13.3331 11.5556 12.8887 10.9334 12.2664 10.4C11.7331 9.95558 11.1998 9.51114 10.5776 9.24447C9.86645 9.68892 9.06645 9.95558 8.08867 9.95558C7.19978 9.95558 6.31089 9.68892 5.59978 9.24447C4.62201 9.68892 3.73312 10.4 3.11089 11.3778C2.48867 12.3556 2.13312 13.4222 2.13312 14.5778C2.13312 14.7556 2.04423 14.9334 1.95534 15.0222C1.86645 15.2 1.68867 15.2889 1.51089 15.2889ZM8.08867 2.22225C7.46645 2.22225 6.84423 2.40003 6.31089 2.75558C5.68867 3.11114 5.33312 3.64447 5.06645 4.1778C4.79978 4.80003 4.71089 5.42225 4.88867 6.13336C4.97756 6.75558 5.33312 7.37781 5.77756 7.82225C6.22201 8.26669 6.84423 8.62225 7.46645 8.71114C7.64423 8.71114 7.91089 8.80003 8.08867 8.80003C8.53312 8.80003 8.97756 8.71114 9.33312 8.53336C9.95534 8.26669 10.3998 7.91114 10.8442 7.28892C11.1998 6.75558 11.3776 6.13336 11.3776 5.51114C11.3776 4.62225 11.022 3.82225 10.3998 3.20003C9.77756 2.48892 8.97756 2.22225 8.08867 2.22225Z"
                                            fill="#560CE3"
                                          />
                                        </svg>
                                      </span>
                                      <span>{writer}</span>
                                    </span>
                                  )}

                                  {item.date && (
                                    <span className={styles.metaItem}>
                                      <span className={styles.metaIcon}>
                                        <svg
                                          width="14"
                                          height="14"
                                          viewBox="0 0 14 14"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M9.76501 0.777771V3.26668M4.23413 0.777771V3.26668M0.777344 5.75548H13.2218M2.16006 2.02211H11.8391C12.6027 2.02211 13.2218 2.57927 13.2218 3.26656V11.9778C13.2218 12.6651 12.6027 13.2222 11.8391 13.2222H2.16006C1.39641 13.2222 0.777344 12.6651 0.777344 11.9778V3.26656C0.777344 2.57927 1.39641 2.02211 2.16006 2.02211Z"
                                            stroke="#560CE3"
                                            strokeWidth="0.977778"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <span>{item.date}</span>
                                    </span>
                                  )}

                                  {item.time && (
                                    <span className={styles.metaItem}>
                                      <span className={styles.metaIcon}>
                                        <svg
                                          width="16"
                                          height="16"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M7.99979 3.73329V7.99996L10.8442 9.42218M15.1109 8.00003C15.1109 11.9274 11.9271 15.1111 7.99978 15.1111C4.07242 15.1111 0.888672 11.9274 0.888672 8.00003C0.888672 4.07267 4.07242 0.888916 7.99978 0.888916C11.9271 0.888916 15.1109 4.07267 15.1109 8.00003Z"
                                            stroke="#560CE3"
                                            strokeWidth="1.06667"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <span>{item.time}</span>
                                    </span>
                                  )}
                                </div>
                              )}

                              <p
                                className={styles.cardExcerpt}
                                dangerouslySetInnerHTML={{
                                  __html: getLimitedHtml(
                                    item.description || "",
                                    150,
                                  ),
                                }}
                              />

                              <div className={styles.cardFooter}>
                                <span className="tg-btn tg-btn-switch-animation btn-blogs">
                                  <Link
                                    href={`/blog-details?url=${item.url}&id=${item.id}`}
                                  >
                                    {" "}
                                    <Button text="Read More" />{" "}
                                  </Link>
                                </span>
                              </div>
                            </div>
                          </article>
                        </div>
                      );
                    })
                  )}
                </div>

                {totalPages > 1 && blogData.length > 0 && (
                  <div className={styles.paginationWrapper}>
                    <nav>
                      <Pagination
                        currentPage={localPagination.currentPage}
                        totalPages={localPagination.totalPage}
                        onPageChange={handlePageChange}
                      />
                    </nav>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="col-xl-3 col-lg-4">
            <div className={styles.sidebarWrapper}>
              <BlogSidebar {...sidebarProps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArea;
