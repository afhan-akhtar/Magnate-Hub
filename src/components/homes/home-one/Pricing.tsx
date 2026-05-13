"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import pricing_data from "@/data/PricingData";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";

type PricingItem = {
  id: number;
  title: string;
  slug?: string;
  price: number | string;
  desc: string;
  list: string[];
  suitable?: string;
};

const swiperOptions = {
  slidesPerView: 4,
  loop: true,
  spaceBetween: 30,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  pagination: false,
  breakpoints: {
    1400: { slidesPerView: 4 },
    1200: { slidesPerView: 3 },
    768: { slidesPerView: 2 },
    0: { slidesPerView: 1 },
  },
};

const Pricing = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  return (
    <div className="tg-pricing-area tg-pricing-su-wrap pb-100 pt-130 p-relative z-index-1">
      <div className="container-fluid px-5">
        {/* ✅ CENTERED HEADING */}
        <div className="row justify-content-center mb-40">
          <div className="col-lg-8 text-center">
            <div className="tg-pricing-section-title-wrap">
              <h2 className="tg-section-su-title mb-0">
                Magnate Hub
                <br />
                Pricing
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="row justify-content-end mb-20">
          <div className="col-lg-3 text-end">
            <div className="tg-listing-5-slider-navigation tg-location-su-slider-navigation">
              <button
                className="tg-listing-5-slide-prev"
                type="button"
                onClick={handlePrev}
              >
                <i className="fa-solid fa-arrow-left-long"></i>
              </button>
              <button
                className="tg-listing-5-slide-next"
                type="button"
                onClick={handleNext}
              >
                <i className="fa-solid fa-arrow-right-long"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Slider */}
        <Swiper
          {...swiperOptions}
          modules={[Autoplay]}
          className="swiper-container tg-location-su-slider"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {pricing_data.map((item: PricingItem) => (
            <SwiperSlide key={item.id} className="swiper-slide">
              <PricingCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

type PricingCardProps = {
  item: PricingItem;
};

const PricingCard: React.FC<PricingCardProps> = ({ item }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showFullText, setShowFullText] = useState(false);

  const isFreePlan = item.id === 5;

  const truncatedText =
    item?.desc?.length > 100 ? item.desc.slice(0, 100) + "..." : item.desc;

  const buyNow = (id: any, slug: string) => {
    if (isAuthenticated) {
      id === 5
        ? router.push(`https://dash.magnatehub.au/dashboard/professionals`)
        : router.push(`/plan/${slug}`);
    } else {
      router.push(`/register?plan=${slug}`);
    }
  };

  return (
    <div className="tg-pricing-wrap mb-30">
      <div className="tg-pricing-head">
        <h4 className="tg-pricing-title mb-15">{item.title}</h4>
      </div>

      <div className="tg-pricing-price mb-25">
        <h2>
          <span>$</span>
          {item.price}
        </h2>
      </div>

      <div className="tg-pricing-btns mb-40">
        <span
          className="tg-btn text-center w-100"
          style={{ cursor: "pointer" }}
          onClick={() => buyNow(item.id, item?.slug || "essentials")}
        >
          {item.id === 5 ? "Select Now" : "Buy Now"}
        </span>
      </div>

      <div className="tg-pricing-list">
        <p className="mb-25 pricing list-desc">
          {showFullText ? item.desc : truncatedText}
          {item?.desc?.length > 100 && (
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="see-more-btn ms-2 border-0 bg-transparent p-0"
              type="button"
            >
              {showFullText ? "See Less" : "See More"}
            </button>
          )}
        </p>

        {!isFreePlan && (
          <div className="d-flex align-items-center gap-2">
            <p className="mb-0">
              <strong style={{ color: "#560ce3" }}>Includes:</strong>
            </p>
            <p className="mb-0">10% GST</p>
          </div>
        )}

        <SimpleBar autoHide={true}>
          <ul className="customScroll">
            {item.list.map((list, i) => (
              <li key={i}>
                <span className="icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 8.26858V9.00458C16.999 10.7297 16.4404 12.4083 15.4075 13.79C14.3745 15.1718 12.9226 16.1826 11.2683 16.6717C9.61394 17.1608 7.8458 17.1021 6.22757 16.5042C4.60934 15.9064 3.22772 14.8015 2.28877 13.3542C1.34981 11.907 0.903833 10.195 1.01734 8.47363C1.13085 6.75223 1.79777 5.11364 2.91862 3.80224C4.03948 2.49083 5.55423 1.57688 7.23695 1.1967C8.91967 0.816507 10.6802 0.990449 12.256 1.69258M17 2.60458L9 10.6126L6.6 8.21258"
                      stroke="#560CE3"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{list}</span>
              </li>
            ))}
          </ul>
        </SimpleBar>
      </div>
    </div>
  );
};

export default Pricing;
