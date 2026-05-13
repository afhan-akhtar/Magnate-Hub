"use client";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import location_bg from "@/assets/img/destination/tu/bg.png";
import { apiRequest } from "@/api/axiosInstance";

type CategoryItem = {
  category_id?: number | string;
  card?: string;
  name: string;
  total?: number | string;
  image?: string;
};

const setting = {
  slidesPerView: 4,
  loop: true,
  spaceBetween: 30,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  pagination: false,
  breakpoints: {
    1400: {
      slidesPerView: 4,
    },
    1200: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
};

const Category = () => {
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState<CategoryItem[]>([]);
  const swiperRef = useRef<SwiperType | null>(null);

  // Navigation buttons ke refs
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const getLocationData = async () => {
    try {
      setLoading(true);
      const response = await apiRequest({
        method: "GET",
        url: "categories",
      });
      setLocationData(response?.data || []);
    } catch (error) {
      console.error("Error fetching location data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationData();
  }, []);

  return (
    <div className="tg-location-area p-relative z-index-1 pb-65 pt-120">
      <div className="tg-location-su-bg">
        <Image src={location_bg} alt="" />
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-9">
            <div className="tg-location-section-title mb-30">
              <h5
                className="tg-section-su-subtitle mb-15 wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                Categories
              </h5>
              <h2
                className="tg-section-su-title wow fadeInUp"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                Explore a world of possibilities with our curated selection of
                businesses for sale and investment opportunities.
              </h2>
            </div>
          </div>
          <div className="col-lg-3">
            <div
              className="tg-listing-5-slider-navigation tg-location-su-slider-navigation text-end mb-30 wow fadeInUp"
              data-wow-delay=".4s"
              data-wow-duration="1s"
            >
              {/* Prev Button */}
              <button
                className="tg-listing-5-slide-prev"
                ref={prevRef}
                type="button"
              >
                <i className="fa-solid fa-arrow-left-long"></i>
              </button>

              {/* Next Button */}
              <button
                className="tg-listing-5-slide-next"
                ref={nextRef}
                type="button"
              >
                <i className="fa-solid fa-arrow-right-long"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {loading ? (
              <div>
                <h6>Loading...</h6>
              </div>
            ) : locationData.length === 0 ? (
              <div>
                <h6>No categories found.</h6>
              </div>
            ) : (
              <div
                onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
                onMouseLeave={() => swiperRef.current?.autoplay?.start()}
              >
                <Swiper
                  {...setting}
                  modules={[Autoplay, Navigation]}
                  className="swiper-container tg-location-su-slider"
                  // Yahan Swiper ko bata rahe hain ke navigation in buttons se hoga
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    if (
                      prevRef.current &&
                      nextRef.current &&
                      swiper.params.navigation &&
                      typeof swiper.params.navigation !== "boolean"
                    ) {
                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;
                      swiper.navigation.init();
                      swiper.navigation.update();
                    }
                  }}
                >
                  {locationData.map((item, index) => (
                    <SwiperSlide
                      key={item.category_id || index}
                      className="swiper-slide"
                    >
                      <div className="tg-location-3-wrap tg-location-su-wrap p-relative mb-30 tg-round-25">
                        <div className="tg-location-thumb tg-round-25">
                          <Image
                            className="w-100 tg-round-25"
                            src={`${item?.image}`}
                            alt="categories"
                            width={400}
                            height={300}
                            unoptimized
                            onError={(e) => {
                              e.currentTarget.src =
                                "assets/img/notfound/image_notfound.png";
                            }}
                          />
                        </div>
                        <div className="tg-location-content tg-location-su-content">
                          <div className="content">
                            <h3 className="tg-location-title mb-5">
                             {item.name}
                            </h3>
                            <span className="tg-location-su-duration">
                              {item.total}
                            </span>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
