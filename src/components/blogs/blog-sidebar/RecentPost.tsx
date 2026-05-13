import { useEffect, useState } from "react";
import { apiRequest } from "@/api/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/components/loading/Loading";

import styles from "./RecentPost.module.css";

interface RecentBlog {
  id: number;
  url: string;
  card: string;
  name: string;
  date?: string;
  image?: string;
}

const RecentPost = () => {
  const [blogsLoading, setBlogsLoading] = useState<boolean>(true);
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);

  const getRecentBlogs = async () => {
    try {
      setBlogsLoading(true);
      const response = await apiRequest({
        url: `GetAllRecentBlogs`,
        method: "GET",
      });

      // Assume API returns array; fallback to []
      const data = Array.isArray(response.data) ? response.data : [];
      setRecentBlogs(data);
    } catch (error) {
      console.error("Error fetching recent blogs:", error);
      setRecentBlogs([]);
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => {
    getRecentBlogs();
  }, []);

  const truncateTitle = (title: string, limit = 60) => {
    if (!title) return "";
    return title.length > limit ? `${title.slice(0, limit)}...` : title;
  };

  return (
    <div className={styles.recentBox}>
      <h5 className={styles.sidebarTitle}>Recent Blogs</h5>

      {blogsLoading ? (
        <div className={styles.loadingWrapper}>
          <Loading />
        </div>
      ) : recentBlogs.length === 0 ? (
        <div className={styles.emptyState}>Blogs not found</div>
      ) : (
        <div className={styles.postList}>
          {recentBlogs.map((item) => (
            <Link
              key={item.id}
              href={`/blog-details?url=${item.url}&id=${item.id}`}
              className={styles.postItem}
            >
              <div className={styles.thumbWrapper}>
                <Image
                  src={String(item.image)}
                  width={80}
                  height={80}
                  alt={item.name}
                  className={styles.postThumbImage}
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.src =
                      "/assets/img/notfound/image_notfound.png";
                  }}
                />
              </div>

              <div className={styles.postContent}>
                <h4 className={styles.postTitle}>
                  {truncateTitle(item.name, 60)}
                </h4>

                {item.date && (
                  <span className={styles.postDate}>
                    <span className={styles.dateIcon}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.76501 0.777832V3.26675M4.23413 0.777832V3.26675M0.777344 5.75554H13.2218M2.16006 2.02217H11.8391C12.6027 2.02217 13.2218 2.57933 13.2218 3.26662V11.9778C13.2218 12.6651 12.6027 13.2223 11.8391 13.2223H2.16006C1.39641 13.2223 0.777344 12.6651 0.777344 11.9778V3.26662C0.777344 2.57933 1.39641 2.02217 2.16006 2.02217Z"
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPost;
