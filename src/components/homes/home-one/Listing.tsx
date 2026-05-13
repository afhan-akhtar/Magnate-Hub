"use client";
import { useEffect, useRef, useState } from "react";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import type { Product } from "@/redux/features/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/api/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import Wishlist from "@/svg/home-one/Wishlist";
import Loading from "@/components/loading/Loading";
import Location from "@/svg/home-one/Location";
import Pagination from "@/components/pagination/Pagination";
type ListingItem = {
  id: number;
  url: string;
  project_id: number | string;
  category_name: string;
  card: string;
  name: string;
  tag?: string;
  user_type?: string | number;
  user_company_name?: string;
  user_company_logo?: string;
  location_name?: string;
  price?: string | number;
  premium?: string | number;
  images?: string[];
  title_image: string;
};

type CategoryItem = {
  name: string;
  card?: string;
  image?: string;
};

type RootState = {
  wishlist: {
    wishlist: Array<{ id: number }>;
  };
};

type listingProps = {
  listing: ListingItem[];
  pagination?: {
    totalPage: number;
    currentPage: number;
    perPage: number;
    total: number;
    nextPageUrl?: string | null;
    prevPageUrl?: string | null;
  };
  onPageChange?: (page: number) => void;
  activePage?: number;
};

const getListingSliderBreakpoints = (count: number) => ({
  1400: { slidesPerView: Math.min(count, 4) || 1 },
  1200: { slidesPerView: Math.min(count, 4) || 1 },
  992: { slidesPerView: Math.min(count, 3) || 1 },
  768: { slidesPerView: Math.min(count, 2) || 1 },
  0: { slidesPerView: 1 },
});

const formatListingPrice = (price?: string | number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
};

const sortListingsNewestFirst = <T extends { id?: number | string; project_id?: number | string }>(
  items: T[],
) => {
  return [...items].sort((a, b) => {
    const aValue = Number(a.project_id ?? a.id ?? 0);
    const bValue = Number(b.project_id ?? b.id ?? 0);

    return bValue - aValue;
  });
};

const truncateText = (value: string, limit: number) => {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, Math.max(limit - 3, 0)).trimEnd()}...`;
};

const getCompanyInitials = (value?: string) => {
  if (!value?.trim()) {
    return "MH";
  }

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

type ListingCardProps = {
  item: ListingItem;
  isInWishlist: boolean;
  handleAddToWishlist: (item: ListingItem) => void;
  redirectUser: (item: ListingItem) => void;
};

const Listing = ({
  listing,
  pagination,
  onPageChange,
  activePage,
}: listingProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);
  const [data, setData] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<CategoryItem[]>([]);
  const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);

  const handleAddToWishlist = (item: ListingItem) => {
    const wishlistItem: Product = {
      id: item.id,
      title: item.name,
      thumb: item.title_image || "",
      price: Number(item.price || 0),
      name: item.name,
      location_name: item.location_name || "",
      title_image: item.title_image || "",
      category_name: item.category_name,
      url: item.url,
      project_id: item.project_id,
    };

    dispatch(addToWishlist(wishlistItem));
  };

  useEffect(() => {
    if (listing && listing.length > 0) {
      setData(sortListingsNewestFirst(listing));
      setLoading(false);
    } else {
      setData([]);
      setLoading(false);
    }
  }, [listing]);

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

    if (getImage?.image) {
      const fileName = getImage.image.split("/").pop();
      return fileName;
    }
  };

  const redirectUser = (item: ListingItem) => {
    if (typeof window !== "undefined" && item?.category_name) {
      window.localStorage.removeItem("categoryName");
      window.localStorage.setItem("categoryName", item.category_name);
    }
    const imageUrl = showImageAccordingToCategory(item?.category_name) || "";
    if (typeof window !== "undefined" && item?.category_name) {
      window.localStorage.setItem("categoryName", item.category_name);
    }
    router.push(
      `/detail?url=${item.url}&id=${item.id}&category=${encodeURIComponent(imageUrl)}`,
    );
  };

  const totalPages = pagination?.totalPage || 1;
  const currentPage =
    activePage !== undefined ? activePage : pagination?.currentPage || 1;
  const hasMultipleSlides = data.length > 1;
  const enableLoop = data.length > 3;
  const listingSliderBreakpoints = getListingSliderBreakpoints(data.length);

  const isInWishlist = (id: number) => {
    return wishlist.some((item) => item.id === id);
  };

  const handlePrev = () => {
    if (hasMultipleSlides && swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (hasMultipleSlides && swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <div
      id="listing-results"
      className="tg-listing-area pb-80 tg-grey-bg-2 pt-120 p-relative"
      style={{
        overflowX: "hidden",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="tg-listing-section-title-wrap text-center mb-40">
              <h5 className="tg-section-su-subtitle su-subtitle-2 mb-15">
                Premium Listings
              </h5>
              <h2 className="tg-section-su-title mb-15">
                Explore our exclusive portfolio of premium listings at Magnate
                Hub
              </h2>
            </div>
          </div>
        </div>

        {hasMultipleSlides && (
          <div className="row justify-content-end mb-20">
            <div className="col-lg-3 text-end">
              <div className="tg-listing-5-slider-navigation tg-location-su-slider-navigation home-listing-nav">
                <button
                  className="tg-listing-5-slide-prev"
                  type="button"
                  onClick={handlePrev}
                  aria-label="Show previous listings"
                >
                  <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <button
                  className="tg-listing-5-slide-next"
                  type="button"
                  onClick={handleNext}
                  aria-label="Show next listings"
                >
                  <i className="fa-solid fa-arrow-right-long"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="container-fluid p-0">
        <div className="row">
          {loading ? (
            <Loading loadingText={"Loading..."} />
          ) : data.length > 0 ? (
            <div className="col-12">
              <Swiper
                modules={[Autoplay]}
                className="swiper-container tg-location-su-slider home-premium-listing-slider"
                spaceBetween={22}
                speed={900}
                centeredSlides={true}
                slidesPerGroup={1}
                watchOverflow={true}
                slidesPerView={1}
                loop={enableLoop}
                rewind={hasMultipleSlides && !enableLoop}
                autoplay={
                  hasMultipleSlides
                    ? {
                        delay: 3200,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                    : false
                }
                breakpoints={listingSliderBreakpoints}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
              >
                {data.map((item) => (
                  <SwiperSlide
                    key={item.id}
                    className="swiper-slide"
                    style={{ height: "auto" }}
                    onClick={() => redirectUser(item)}
                  >
                    <div style={{ height: "100%", paddingTop: "12px" }}>
                      <ListingCard
                        item={item}
                        isInWishlist={isInWishlist(item.id)}
                        handleAddToWishlist={handleAddToWishlist}
                        redirectUser={redirectUser}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="col-12 text-center py-5">
              <p>No listings found.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="col-12 text-center mt-50 mb-30">
              <nav>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    if (onPageChange) onPageChange(page);
                  }}
                />
              </nav>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .home-premium-listing-slider {
          overflow: hidden;
        }

        .home-premium-listing-slider .swiper-wrapper {
          padding: 20px 0;
        }

        .home-premium-listing-wishlist {
          top: 0;
          right: 0;
          transition:
            opacity 0.2s ease,
            visibility 0.2s ease,
            transform 0.2s ease;
        }

        .home-premium-listing-profile-name {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
          transition:
            opacity 0.18s ease,
            visibility 0.18s ease,
            transform 0.18s ease;
        }

        @media (hover: hover) and (pointer: fine) {
          .home-premium-listing-wishlist {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: translate(-10px, 10px);
          }

          .home-premium-listing-card:hover .home-premium-listing-wishlist {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translate(0, 0);
          }

          .home-premium-listing-card:hover .home-premium-listing-profile-name {
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

const ListingCard = ({
  item,
  isInWishlist,
  handleAddToWishlist,
  redirectUser,
}: ListingCardProps) => {
  const isFranchiseBooker = String(item?.user_type) === "broker";
  const companyName = item?.user_company_name?.trim() || "";
  const companyLogoUrl = item?.user_company_logo?.trim()
    ? item.user_company_logo
    : "";
  const companyInitials = getCompanyInitials(companyName);
  const hasCompanyName = Boolean(companyName);
  const verificationSource = item?.user_company_name?.trim() || "partner";
  const listingCode = `MGH-${new Date().getFullYear()}-${item.id}`;

  return (
    <div
      className="tg-listing-card-item tg-listing-su-card-item home-premium-listing-card mb-25"
      style={{
        cursor: "pointer",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "28px",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(180deg, #ffffff 0%, #fcfbff 100%)",
        border: "1px solid rgba(100, 91, 255, 0.08)",
        boxShadow: "0 18px 50px rgba(50, 38, 120, 0.10)",
        padding: "16px",
        transition: "transform .18s ease, box-shadow .18s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 24px 60px rgba(50, 38, 120, 0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = "0 18px 50px rgba(50, 38, 120, 0.10)";
      }}
      onClick={() => redirectUser(item)}
    >
      <div
        className="home-premium-listing-media"
        style={{
          position: "relative",
          width: "100%",
          height: "250px",
          overflow: "hidden",
          background: "#f6f6f6",
          borderRadius: "24px",
        }}
      >
        {isFranchiseBooker && (
          <div
            className="home-premium-listing-profile"
            style={{
              position: "absolute",
              left: "16px",
              top: "12px",
              zIndex: 8,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                position: "relative",
                width: "38px",
                height: "38px",
                borderRadius: "999px",
                overflow: "hidden",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
                background: "linear-gradient(135deg, #6d4cff 0%, #3d73ff 100%)",
                boxShadow: "0 10px 22px rgba(70, 62, 180, 0.22)",
              }}
            >
              <Image
                src={companyLogoUrl || "/assets/company-profile.png"}
                alt={companyName || "Company profile"}
                fill
                unoptimized
                style={{ objectFit: "cover" }}
              />
            </span>

            {hasCompanyName && (
              <span
                className="home-premium-listing-profile-name"
                title={companyName}
                style={{
                  maxWidth: "180px",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  background: "rgba(15,23,42,0.96)",
                  color: "#f9fafb",
                  fontSize: "11px",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {companyName}
              </span>
            )}
          </div>
        )}

        <Image
          className="tg-card-border w-100"
          src={`https://dash.magnatehub.au${item.title_image}`}
          alt={item?.name || "Project listing image"}
          width={250}
          height={250}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "250px",
            transform: "scale(1.02)",
          }}
          unoptimized
          onError={(e) => {
            e.currentTarget.src = "assets/img/notfound/image_notfound.png";
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(32,24,68,0.10), rgba(32,24,68,0) 52%, rgba(32,24,68,0.10))",
            pointerEvents: "none",
          }}
        />
        <div
          className="tg-listing-item-wishlist home-premium-listing-wishlist"
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            zIndex: 7,
          }}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              handleAddToWishlist(item);
            }}
            style={{
              cursor: "pointer",
              width: "52px",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 0,
              borderRadius: "999px",
              background: "rgba(255,255,255,0.96)",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
              backdropFilter: "blur(8px)",
            }}
            aria-label="Add to wishlist"
          >
            <Wishlist
              filled={isInWishlist}
              style={{
                color: isInWishlist ? "#e11d48" : "#444",
                display: "block",
                flex: "0 0 auto",
              }}
            />
          </a>
        </div>

        <span
          title={item.category_name}
          style={{
            position: "absolute",
            left: "16px",
            bottom: "16px",
            zIndex: 6,
            maxWidth: "72%",
            padding: "6px 12px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(90,69,181,0.08)",
            color: "#5a45b5",
            fontSize: "10.5px",
            fontWeight: 700,
            lineHeight: 1.15,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            backdropFilter: "blur(8px)",
          }}
        >
          {item.category_name}
        </span>

        {isFranchiseBooker && (
          <span
            style={{
              position: "absolute",
              right: "16px",
              bottom: "16px",
              zIndex: 6,
              padding: "4px 10px",
              borderRadius: "999px",
              background:
                "linear-gradient(180deg, rgba(22, 163, 74, 0.95) 0%, rgba(16, 185, 129, 0.95) 100%)",
              border: "1px solid rgba(22, 163, 74, 0.95)",
              color: "#ecfdf3",
              fontSize: "10px",
              fontWeight: 700,
              lineHeight: 1.1,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              boxShadow: "0 10px 22px rgba(22, 163, 74, 0.33)",
              backdropFilter: "blur(6px)",
            }}
          >
            verified
          </span>
        )}
      </div>

      <div
        className="tg-listing-card-content"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "20px 8px 6px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "10px",
            flexWrap: "wrap",
            minHeight: "30px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#7b8397",
              margin: 0,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {listingCode}
          </p>
        </div>

        <h4
          className="tg-listing-card-title"
          style={{
            margin: "0 0 16px",
            minWidth: 0,
            minHeight: "42px",
          }}
        >
          <Link href={`/detail?url=${item.url}&id=${item.project_id}`}>
            <span
              style={{
                fontWeight: 800,
                fontSize: "17px",
                color: "#111827",
                letterSpacing: "-0.04em",
                lineHeight: 1.22,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              title={item.name}
            >
              {item.name}
            </span>
          </Link>
        </h4>

        <div>
          <div
            className="mt-10 pt-20 border-top"
            style={{
              paddingTop: 18,
              borderTop: "1px solid rgba(201,204,220,0.7)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#334155",
                  letterSpacing: "-0.05em",
                  lineHeight: 0.95,
                }}
              >
                ${formatListingPrice(item.price)}
              </span>

              {item.location_name && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "8px",
                    minWidth: 0,
                    flex: "0 1 58%",
                  }}
                >
                  <span
                    style={{
                      color: "#7d8497",
                      display: "inline-flex",
                      alignItems: "center",
                      flex: "0 0 auto",
                    }}
                  >
                    <Location />
                  </span>
                  <span
                    style={{
                      minWidth: 0,
                      color: "#7d8497",
                      fontSize: "12px",
                      fontWeight: 500,
                      lineHeight: 1.3,
                      textAlign: "right",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={item.location_name}
                  >
                    {truncateText(item.location_name, 28)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
