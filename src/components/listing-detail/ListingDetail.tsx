"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { apiRequest, BACKEND_ORIGIN } from "@/api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import styles from "./ListingDetail.module.css";
import Loading from "../loading/Loading";
import { useRouter } from "next/navigation";
import { FaTag } from "react-icons/fa";

interface ListingDetailProps {
  url: string;
  id: string;
}

const ListingDetail: React.FC<ListingDetailProps> = ({ url, id }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const wishlist = useSelector((state: any) => state.wishlist.wishlist);
  const { isAuthenticated } = useAuth();
  const [listing, setListing] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [similarListing, setSimilarListing] = useState<any>([]);
  const [similarLoading, setSimilarLoading] = useState<boolean>(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  const getProductDetails = async () => {
    try {
      setLoading(true);
      const response = await apiRequest({
        url: `projects?id=${id}`,
        method: "GET",
      });
      setListing(response.data?.data[0]);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSimilarListing = async () => {
    try {
      setSimilarLoading(true);
      const response = await apiRequest({
        url: `GetSimilarProjects?project_id=${id}`,
        method: "GET",
      });
      setSimilarListing(response.data);
    } catch (error) {
      throw error;
    } finally {
      setSimilarLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getProductDetails();
    getSimilarListing();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const parseImage = (Image: string) => {
    if (Image) {
      return JSON.parse(Image);
    }
    return [];
  };

  const handleAddToWishlist = (item: any) => {
    dispatch(addToWishlist(item));
  };

  const getCategoryData = async () => {
    try {
      setLoading(true);
      const response = await apiRequest({
        method: "GET",
        url: "categories",
      });
      setCategoryData(response?.data || []);
    } catch (error) {
      console.error("Error fetching location data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  const showImageAccordingToCategory = (category: string) => {
    const getImage = categoryData?.find((x) => x.name === category);
    if (getImage?.card) {
      return getImage?.card;
    }
  };

  const redirectUser = (item: any) => {
    if (typeof window !== "undefined" && item?.category_name) {
      window.localStorage.removeItem("categoryName");
      window.localStorage.setItem("categoryName", item.category_name);
    }
    let imageUrl = showImageAccordingToCategory(item?.category_name);
    router.push(
      `/detail?url=${item.url}&id=${
        item.project_id
      }&category=${encodeURIComponent(imageUrl)}`,
    );
  };

  const openChatWithSeller = (userId: string, projectId: string) => {
    const url = `https://dash.magnatehub.au/dashboard/professionals/chat?project_id=${projectId}&user_id=${userId}`;
    window.open(url, "_blank");
  };

  const isInWishlist = (id: number) => {
    return wishlist.some((item: any) => item.id === id);
  };

  const galleryUrls = useMemo(() => {
    const urls: string[] = [];
    const pushPath = (path: string | undefined | null) => {
      if (!path || typeof path !== "string") return;
      const full =
        path.startsWith("http://") || path.startsWith("https://")
          ? path
          : `${BACKEND_ORIGIN}${path}`;
      if (!urls.includes(full)) urls.push(full);
    };

    pushPath(listing?.title_image);

    let extra = listing?.images;
    if (typeof extra === "string") {
      try {
        extra = JSON.parse(extra);
      } catch {
        extra = [];
      }
    }
    if (Array.isArray(extra)) {
      extra.forEach((img: string) => pushPath(img));
    }

    return urls;
  }, [listing]);

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const galleryPrevRef = useRef<HTMLButtonElement>(null);
  const galleryNextRef = useRef<HTMLButtonElement>(null);

  const isFranchiseBooker = String(listing?.user_type) === "4";

  const getCompanyLogoUrl = (logo: string) => {
    if (!logo) return "";
    if (logo.startsWith("http://") || logo.startsWith("https://")) return logo;
    return `https://dash.magnatehub.au${logo}`;
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className={styles._listingContainer}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12">
              {!loading ? (
                <>
                  <div className={`card p-4 mb-3 ${styles.headerCard}`}>
                    <div className="d-lg-flex justify-content-between align-items-start">
                      <div>
                        <h4 className={styles.title}>
                          {listing?.name
                            ? listing?.name.length > 80
                              ? listing?.name.slice(0, 80) + "..."
                              : listing?.name
                            : ""}
                        </h4>
                        <h5 className={styles.host}>
                          <i className="fa-solid fa-user me-2"></i>
                          <span>Hosted By:</span>{" "}
                          {listing?.user_first_name + " " + listing?.user_last_name || "N/A"}
                        </h5>
                        {listing?.category_name && (
                          <p className={styles.categoryDesign}>
                            <FaTag size={12} style={{ color: "#560ce3" }} />
                            {listing?.category_name}
                          </p>
                        )}
                        {isFranchiseBooker && (
                          <div
                            style={{
                              marginTop: "10px",
                              padding: "10px 12px",
                              background: "rgba(86,12,227,0.06)",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              border: "1px solid rgba(86,12,227,0.18)",
                              boxShadow: "0 10px 18px rgba(86,12,227,0.08)",
                            }}
                          >
                            {listing?.user_company_logo && (
                              <Image
                                src={getCompanyLogoUrl(
                                  listing.user_company_logo,
                                )}
                                alt={
                                  listing?.user_company_name || "Company Logo"
                                }
                                width={40}
                                height={40}
                                unoptimized
                                style={{
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "2px solid rgba(86,12,227,0.25)",
                                  background: "#fff",
                                  boxShadow: "0 8px 14px rgba(0,0,0,0.10)",
                                  flex: "0 0 auto",
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                minWidth: 0,
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 800,
                                  fontSize: "14px",
                                  color: "#560CE3",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                {listing?.user_company_name ||
                                  "Verified Franchise Partner"}

                                <i
                                  className="fa-solid fa-circle-check"
                                  style={{
                                    color: "#560CE3", 
                                    fontSize: "14px",
                                    flex: "0 0 auto",
                                  }}
                                />
                              </span>

                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  color: "rgba(86,12,227,0.75)", 
                                }}
                              >
                                Verified Partner
                              </span>
                            </div>
                          </div>
                        )}
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#777",
                            marginTop: "10px",
                            marginBottom: "-6px",
                          }}
                        >
                          MGH-{new Date().getFullYear()}-{listing?.id}
                        </p>
                      </div>
                      <div
                        className={styles.wishlistContainer}
                        onClick={() => handleAddToWishlist(listing)}
                      >
                        <p className={styles.wishlistText}>
                          <i
                            className={`fa-heart me-1 ${
                              isInWishlist(listing?.id)
                                ? "fa-solid text-danger"
                                : "fa-regular"
                            }`}
                            style={{ cursor: "pointer" }}
                          ></i>
                          {isInWishlist(listing?.id)
                            ? "Added to Favorite"
                            : "Add To Favorite"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`card p-3 mb-3 ${styles.hero_img}`}>
                    {galleryUrls.length === 0 ? (
                      <Image
                        className={`w-100 rounded ${styles.listingImage}`}
                        src="/assets/img/notfound/image_notfound.png"
                        alt="No images"
                        width={800}
                        height={500}
                        unoptimized
                        style={{ objectFit: "cover", maxHeight: 480 }}
                      />
                    ) : galleryUrls.length === 1 ? (
                      <Image
                        className={`w-100 rounded ${styles.listingImage}`}
                        src={galleryUrls[0]}
                        alt="Project Image"
                        width={800}
                        height={500}
                        unoptimized
                        style={{ objectFit: "cover", maxHeight: 520 }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "/assets/img/notfound/image_notfound.png";
                        }}
                      />
                    ) : (
                      <div className={styles.galleryWrap} key={`gallery-${id}`}>
                        <div
                          className={`position-relative ${styles.galleryMain}`}
                        >
                          <button
                            ref={galleryPrevRef}
                            type="button"
                            className={`${styles.imageNavButton} ${styles.galleryNavPrev}`}
                            aria-label="Previous image"
                          >
                            ‹
                          </button>
                          <button
                            ref={galleryNextRef}
                            type="button"
                            className={`${styles.imageNavButton} ${styles.galleryNavNext}`}
                            aria-label="Next image"
                          >
                            ›
                          </button>
                          <Swiper
                            modules={[FreeMode, Navigation, Thumbs]}
                            rewind
                            spaceBetween={0}
                            slidesPerView={1}
                            onBeforeInit={(swiper) => {
                              if (
                                typeof swiper.params.navigation !== "boolean" &&
                                swiper.params.navigation &&
                                galleryPrevRef.current &&
                                galleryNextRef.current
                              ) {
                                swiper.params.navigation.prevEl =
                                  galleryPrevRef.current;
                                swiper.params.navigation.nextEl =
                                  galleryNextRef.current;
                              }
                            }}
                            onSwiper={(swiper) => {
                              if (
                                typeof swiper.params.navigation !== "boolean" &&
                                swiper.params.navigation &&
                                galleryPrevRef.current &&
                                galleryNextRef.current
                              ) {
                                swiper.params.navigation.prevEl =
                                  galleryPrevRef.current;
                                swiper.params.navigation.nextEl =
                                  galleryNextRef.current;
                                swiper.navigation.init();
                                swiper.navigation.update();
                              }
                            }}
                            thumbs={{
                              swiper:
                                thumbsSwiper && !thumbsSwiper.destroyed
                                  ? thumbsSwiper
                                  : undefined,
                            }}
                            className={styles.galleryMainSwiper}
                          >
                            {galleryUrls.map((src, i) => (
                              <SwiperSlide key={`${src}-${i}`}>
                                <div className={styles.gallerySlideInner}>
                                  <Image
                                    className={`w-100 rounded ${styles.listingImage}`}
                                    src={src}
                                    alt={`Project image ${i + 1}`}
                                    width={900}
                                    height={560}
                                    unoptimized
                                    style={{
                                      objectFit: "cover",
                                      maxHeight: 520,
                                      width: "100%",
                                      height: "auto",
                                    }}
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "/assets/img/notfound/image_notfound.png";
                                    }}
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>

                        <Swiper
                          onSwiper={setThumbsSwiper}
                          spaceBetween={10}
                          slidesPerView={4}
                          freeMode
                          watchSlidesProgress
                          modules={[FreeMode, Thumbs]}
                          breakpoints={{
                            0: { slidesPerView: 3, spaceBetween: 8 },
                            576: { slidesPerView: 4, spaceBetween: 10 },
                            992: { slidesPerView: 5, spaceBetween: 12 },
                          }}
                          className={styles.galleryThumbs}
                        >
                          {galleryUrls.map((src, i) => (
                            <SwiperSlide key={`thumb-${src}-${i}`}>
                              <div className={styles.galleryThumbInner}>
                                <Image
                                  src={src}
                                  alt={`Thumbnail ${i + 1}`}
                                  width={160}
                                  height={120}
                                  unoptimized
                                  style={{
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/assets/img/notfound/image_notfound.png";
                                  }}
                                />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    )}
                  </div>

                  <div className={`card p-4 mb-4 ${styles.infoCard}`}>
                    <h3 className={`mb-4 ${styles.sectionTitle}`}>
                      <i className="fa-solid fa-chart-line me-2"></i>
                      Business Overview
                    </h3>

                    <div className="row g-4">
                      {[
                        {
                          label: "Price",
                          value: listing?.price ? `$${listing.price}` : "N/A",
                          icon: "fa-solid fa-dollar-sign",
                          color: "#10b981",
                        },
                        {
                          label: "Location",
                          value: listing?.location_name || "N/A",
                          icon: "fa-solid fa-location-dot",
                          color: "#ef4444",
                        },
                        {
                          label: "Category",
                          value: listing?.category_name || "N/A",
                          icon: "fa-solid fa-tags",
                          color: "#3b82f6",
                        },
                        {
                          label: "Yearly Trading",
                          value: listing?.trading || "N/A",
                          icon: "fa-solid fa-chart-line",
                          color: "#f59e0b",
                        },
                        {
                          label: "Earning Type",
                          value: listing?.earning_type || "N/A",
                          icon: "fa-solid fa-money-bill-wave",
                          color: "#8b5cf6",
                        },
                        {
                          label: "Stock Level",
                          value: listing?.stock_level || "N/A",
                          icon: "fa-solid fa-boxes-stacked",
                          color: "#06b6d4",
                        },
                      ].map((item, i) => (
                        <div className="col-6 col-md-4" key={i}>
                          <div className={styles.infoItem}>
                            <div
                              className={styles.infoIcon}
                              style={{
                                backgroundColor: `${item.color}15`,
                                color: item.color,
                              }}
                            >
                              <i className={item.icon}></i>
                            </div>
                            <p className={styles.infoLabel}>{item.label}</p>
                            <h6 className={styles.infoValue}>{item.value}</h6>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {[
                    {
                      label: "Summary",
                      value: listing?.summary,
                      icon: "fa-solid fa-file-lines",
                    },
                    {
                      label: "Skills",
                      value: listing?.skills,
                      icon: "fa-solid fa-lightbulb",
                    },
                    {
                      label: "Potential",
                      value: listing?.potential,
                      icon: "fa-solid fa-rocket",
                    },
                    {
                      label: "Hours",
                      value: listing?.hours,
                      icon: "fa-solid fa-clock",
                    },
                    {
                      label: "Staff",
                      value: listing?.staff,
                      icon: "fa-solid fa-users",
                    },
                    {
                      label: "Lease",
                      value: listing?.lease,
                      icon: "fa-solid fa-file-contract",
                    },
                    {
                      label: "Business",
                      value: listing?.business_established,
                      icon: "fa-solid fa-building",
                    },
                    {
                      label: "Training",
                      value: listing?.training,
                      icon: "fa-solid fa-graduation-cap",
                    },
                    {
                      label: "Awards",
                      value: listing?.awards,
                      icon: "fa-solid fa-trophy",
                    },
                    {
                      label: "Selling Reason",
                      value: listing?.reason_for_sale,
                      icon: "fa-solid fa-info-circle",
                    },
                  ].map(
                    (section, index) =>
                      section.value && (
                        <div
                          key={index}
                          className={`card p-4 mb-3 ${styles.sectionCard}`}
                        >
                          <h3 className={styles.sectionTitle}>
                            <i className={`${section.icon} me-2`}></i>
                            {section.label}
                          </h3>
                          <p className={styles.sectionText}>{section.value}</p>
                        </div>
                      ),
                  )}
                </>
              ) : (
                <Loading loadingText={"Loading Detail Page"} />
              )}
            </div>
            <div className={`col-lg-4 col-md-12 ${styles.sidebarColumn}`}>
              <div className={styles.sidebarSticky}>
                <div className={`card p-4 mb-3 ${styles.chatCard}`}>
                  <div className={styles.chatHeader}>
                    <i className="fa-solid fa-comments me-2"></i>
                    <h4 className="mb-0">Chat with Seller</h4>
                  </div>
                  <p className={styles.chatDescription}>
                    Have questions about this listing? Start a conversation with
                    the seller.
                  </p>
                  {!isAuthenticated ? (
                    <button
                      className={styles.chatButton}
                      onClick={() => router.push(`/login`)}
                    >
                      <i className="fa-solid fa-right-to-bracket me-2"></i>
                      Login to Chat
                    </button>
                  ) : (
                    <button
                      className={styles.chatButton}
                      onClick={() =>
                        openChatWithSeller(
                          listing.user_id,
                          listing.project_id,
                        )
                      }
                    >
                      <i className="fa-solid fa-message me-2"></i>
                      Start Chat
                    </button>
                  )}
                </div>
                <div className={`card p-4 ${styles.similarCard}`}>
                  <h3 className={styles.similarTitle}>
                    <i className="fa-solid fa-list me-2"></i>
                    Similar Listings
                  </h3>
                  {similarLoading ? (
                    <Loading loadingText={"Loading..."} />
                  ) : similarListing && similarListing.length === 0 ? (
                    <div className={styles.noSimilar}>
                      <i className="fa-solid fa-inbox mb-3"></i>
                      <p>No Similar Listings Found</p>
                    </div>
                  ) : (
                    <div className={styles.similarList}>
                      {similarListing.map((item: any, index: number) => (
                        <div
                          key={item.id || index}
                          className={styles.similarItem}
                          onClick={() => redirectUser(item)}
                        >
                          <div className={styles.similarImageWrapper}>
                            <Image
                              className={styles.similarImage}
                              src={`https://dash.magnatehub.au/uploads/project/card/${item.card}`}
                              alt="Project Image"
                              width={120}
                              height={100}
                              unoptimized
                              onError={(e) => {
                                e.currentTarget.src =
                                  "assets/img/notfound/image_notfound.png";
                              }}
                            />
                          </div>
                          <div className={styles.similarContent}>
                            <h5 className={styles.similarName}>
                              {item.name && item.name.length > 20
                                ? item.name.slice(0, 20) + "..."
                                : item.name || "Untitled"}
                            </h5>
                            {item.date && (
                              <p className={styles.similarDate}>
                                <i className="fa-solid fa-calendar me-1"></i>
                                {item.date}
                              </p>
                            )}
                            {item.price && (
                              <p className={styles.similarPrice}>
                                <i className="fa-solid fa-dollar-sign me-1"></i>
                                ${item.price}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetail;
