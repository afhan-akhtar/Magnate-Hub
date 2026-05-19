"use client";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
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
import Button from "@/components/common/Button";
import { BrokerListingCard } from "@/components/BrokerListingCardParts";
import {
  isPremiumListing,
  PremiumListingCard,
} from "@/components/PremiumListingCardParts";
import { getListingStatusMode } from "@/lib/listingStatus";
import {
  SoldListingCard,
  UnderOfferListingCard,
} from "@/components/ListingStatusCardParts";

type ListingItem = {
  id: number;
  url: string;
  project_id: number | string;
  category_name: string;
  card: string;
  name: string;
  tag?: string;
  sold?: string | number;
  user_type?: string | number;
  user_company_name?: string;
  user_company_logo?: string;
  user_first_name?: string;
  user_last_name?: string;
  user_image?: string;
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

const PREMIUM_LISTINGS_PER_PAGE = 12;
/** Fixed card width for home listing slider (matches design ~350–400px) */
const HOME_LISTING_CARD_WIDTH_PX = 380;

const HOME_PREMIUM_SLIDER_OPTIONS = {
  slidesPerView: "auto" as const,
  spaceBetween: 22,
  speed: 900,
  slidesPerGroup: 1,
  watchOverflow: true,
};

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

type ListingCardProps = {
  item: ListingItem;
  isInWishlist: boolean;
  handleAddToWishlist: (item: ListingItem) => void;
  redirectUser: (item: ListingItem) => void;
  premiumSection?: boolean;
};

const Listing = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);
  const [data, setData] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllListings, setShowAllListings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  const fetchListings = useCallback(async (page: number, allListings: boolean) => {
    setLoading(true);
    try {
      const url = allListings
        ? `projects?per_page=${PREMIUM_LISTINGS_PER_PAGE}&page=${page}`
        : `projects?premium=1&per_page=${PREMIUM_LISTINGS_PER_PAGE}&page=${page}`;
      const response = await apiRequest({
        method: "GET",
        url,
      });
      const rawResults = response?.data?.data || [];
      const results = allListings
        ? rawResults
        : rawResults.filter(isPremiumListing);
      setData(sortListingsNewestFirst(results));
      setTotalPages(response?.data?.last_page || 1);
      setCurrentPage(response?.data?.current_page || page);
    } catch (error) {
      console.error("Error fetching listings", error);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings(currentPage, showAllListings);
  }, [currentPage, showAllListings, fetchListings]);

  const handleViewAllListings = () => {
    setShowAllListings(true);
    setCurrentPage(1);
  };

  const handleShowPremiumOnly = () => {
    setShowAllListings(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    const getCategoryData = async () => {
      try {
        const response = await apiRequest({
          method: "GET",
          url: "categories",
        });
        setCategoryData(response?.data || []);
      } catch (error) {
        console.error("Error fetching category data", error);
      }
    };

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

  const hasMultipleSlides = data.length > 1;
  const enableLoop = data.length > 4;

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
          <div className="col-lg-8 col-xl-7">
            <div className="tg-listing-section-title-wrap text-center mb-25">
              {!showAllListings ? (
                <>
                  <h5 className="tg-section-su-subtitle su-subtitle-2 mb-15">
                    Premium Listings
                  </h5>
                  <h2 className="tg-section-su-title mb-15">
                    Explore our exclusive portfolio of premium listings at
                    Magnate Hub
                  </h2>
                </>
              ) : (
                <>
                  <h5 className="tg-section-su-subtitle su-subtitle-2 mb-15 home-all-listings-badge">
                    All Listings
                  </h5>
                  <h2 className="tg-section-su-title mb-15">
                    Discover businesses, brokers &amp; opportunities ready for
                    you at Magnate Hub
                  </h2>
                </>
              )}
              {!showAllListings ? (
                <button
                  type="button"
                  className="tg-btn tg-btn-gray tg-btn-switch-animation home-premium-view-all d-inline-flex"
                  onClick={handleViewAllListings}
                >
                  <Button text="View All Listings" />
                </button>
              ) : (
                <button
                  type="button"
                  className="tg-btn tg-btn-gray tg-btn-switch-animation home-premium-view-all d-inline-flex"
                  onClick={handleShowPremiumOnly}
                >
                  <Button text="Show Premium Only" />
                </button>
              )}
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
        <div className="row">
          {loading ? (
            <Loading loadingText={"Loading..."} />
          ) : data.length > 0 ? (
            <div className="col-12">
              <Swiper
                key={showAllListings ? "all-listings" : "premium-listings"}
                {...HOME_PREMIUM_SLIDER_OPTIONS}
                modules={[Autoplay]}
                className="swiper-container tg-location-su-slider home-premium-listing-slider"
                centeredSlides={hasMultipleSlides}
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
                    <div className="home-premium-slide-inner">
                      <ListingCard
                        item={item}
                        isInWishlist={isInWishlist(item.id)}
                        handleAddToWishlist={handleAddToWishlist}
                        redirectUser={redirectUser}
                        premiumSection={!showAllListings}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="col-12 text-center py-5">
              <p>
                {showAllListings
                  ? "No listings found."
                  : "No premium listings found."}
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="col-12 text-center mt-50 mb-30">
              <nav>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </nav>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .home-premium-view-all {
          margin-right: 0;
        }

        .home-all-listings-badge {
          background: #ebe5fa;
          color: var(--tg-theme-primary, #7c3aed);
          display: inline-block;
          padding: 6px 16px;
          border-radius: 999px;
        }

        .home-premium-listing-slider {
          --home-listing-card-width: ${HOME_LISTING_CARD_WIDTH_PX}px;
          overflow: hidden;
          padding: 0 2px;
        }

        .home-premium-listing-slider .swiper-wrapper {
          padding: 20px 0 8px;
          align-items: stretch;
        }

        .home-premium-listing-slider .swiper-slide {
          width: var(--home-listing-card-width) !important;
          max-width: min(
            var(--home-listing-card-width),
            calc(100vw - 48px)
          );
          height: auto;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .home-premium-slide-inner {
          height: 100%;
          padding-top: 12px;
          width: 100%;
          max-width: var(--home-listing-card-width);
          margin: 0 auto;
        }

        .home-premium-listing-slider .magnet-premium-card,
        .home-premium-listing-slider .magnet-broker-card,
        .home-premium-listing-slider .magnet-status-card,
        .home-premium-listing-slider .home-premium-listing-card {
          width: 100%;
          max-width: var(--home-listing-card-width);
        }

        @media (max-width: 767px) {
          .home-premium-listing-slider {
            --home-listing-card-width: 340px;
          }
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

          .home-premium-broker-card:hover .home-premium-broker-title {
            color: #4c1d95;
          }

          .home-premium-broker-card:hover .home-premium-broker-avatar-wrap {
            transform: translateY(-2px) scale(1.02);
          }
        }

        .home-premium-broker-avatar-wrap {
          transition: transform 0.22s cubic-bezier(0.34, 1.46, 0.64, 1);
        }

        .home-premium-listing-slider
          .swiper-slide:has(.home-premium-broker-card),
        .home-premium-listing-slider
          .swiper-slide:has(.home-premium-tier-card) {
          overflow: visible;
        }

        .home-premium-tier-card:hover .home-premium-listing-title {
          color: #9a6700;
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
  premiumSection = false,
}: ListingCardProps) => {
  const statusMode = getListingStatusMode(item);
  const statusCardProps = {
    item,
    detailHref: `/detail?url=${item.url}&id=${item.project_id}`,
    isInWishlist,
    onWishlistClick: (event: MouseEvent) => {
      event.stopPropagation();
      handleAddToWishlist(item);
    },
    onCardClick: () => redirectUser(item),
    listingReferenceField: "id" as const,
    cardClassName: "home-premium-listing-card",
    wishlistClassName: "tg-listing-item-wishlist home-premium-listing-wishlist",
    titleClassName: "home-premium-listing-title",
  };

  if (statusMode === "under_offer") {
    return <UnderOfferListingCard {...statusCardProps} />;
  }

  if (statusMode === "sold") {
    return <SoldListingCard {...statusCardProps} />;
  }

  if (premiumSection && isPremiumListing(item)) {
    return (
      <PremiumListingCard
        item={item}
        detailHref={`/detail?url=${item.url}&id=${item.project_id}`}
        isInWishlist={isInWishlist}
        onWishlistClick={(event) => {
          event.stopPropagation();
          handleAddToWishlist(item);
        }}
        onCardClick={() => redirectUser(item)}
        listingReferenceField="id"
        cardClassName="home-premium-listing-card home-premium-tier-card"
        mediaClassName="home-premium-listing-media"
        wishlistClassName="tg-listing-item-wishlist home-premium-listing-wishlist"
        titleClassName="home-premium-listing-title"
      />
    );
  }

  if (String(item?.user_type) === "broker") {
    return (
      <BrokerListingCard
        item={item}
        detailHref={`/detail?url=${item.url}&id=${item.project_id}`}
        isInWishlist={isInWishlist}
        onWishlistClick={(event) => {
          event.stopPropagation();
          handleAddToWishlist(item);
        }}
        onCardClick={() => redirectUser(item)}
        listingReferenceField="id"
        cardClassName="home-premium-listing-card home-premium-broker-card"
        mediaClassName="home-premium-listing-media"
        wishlistClassName="tg-listing-item-wishlist home-premium-listing-wishlist"
        titleClassName="home-premium-broker-title"
      />
    );
  }

  if (isPremiumListing(item)) {
    return (
      <PremiumListingCard
        item={item}
        detailHref={`/detail?url=${item.url}&id=${item.project_id}`}
        isInWishlist={isInWishlist}
        onWishlistClick={(event) => {
          event.stopPropagation();
          handleAddToWishlist(item);
        }}
        onCardClick={() => redirectUser(item)}
        listingReferenceField="id"
        cardClassName="home-premium-listing-card home-premium-tier-card"
        mediaClassName="home-premium-listing-media"
        wishlistClassName="tg-listing-item-wishlist home-premium-listing-wishlist"
        titleClassName="home-premium-listing-title"
      />
    );
  }

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
        transition:
          "transform 0.22s cubic-bezier(0.34, 1.46, 0.64, 1), box-shadow 0.22s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 24px 60px rgba(50, 38, 120, 0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow =
          "0 18px 50px rgba(50, 38, 120, 0.10)";
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
            backdropFilter: "blur(10px)",
          }}
        >
          {item.category_name}
        </span>

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
                transition: "color 0.15s ease",
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
