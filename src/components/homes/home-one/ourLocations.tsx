"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import location_bg from "@/assets/img/destination/tu/bg.png";
import { apiRequest } from "@/api/axiosInstance";

type LocationItem = {
  location_id: number | string;
  card?: string;
  name?: string;
  image?: string;
};

const swiperOptions = {
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

const OurLocation: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState<LocationItem[]>([]);

  // Swiper instance ref
  const swiperRef = useRef<SwiperType | null>(null);

  const getLocationData = async () => {
    try {
      setLoading(true);
      const response = await apiRequest({
        method: "GET",
        url: "locations",
      });
      setLocationData(response?.data || []);
    } catch (error) {
      console.error("GetAllProjectLocations error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationData();
  }, []);

  // Button handlers
  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handleMouseEnter = () => {
    if (!swiperRef.current?.autoplay) return;

    if (typeof swiperRef.current.autoplay.pause === "function") {
      swiperRef.current.autoplay.pause();
      return;
    }

    swiperRef.current.autoplay.stop();
  };

  const handleMouseLeave = () => {
    if (!swiperRef.current?.autoplay) return;

    if (typeof swiperRef.current.autoplay.resume === "function") {
      swiperRef.current.autoplay.resume();
      return;
    }

    swiperRef.current.autoplay.start();
  };

  return (
    <div className="tg-location-area p-relative z-index-1 pb-65 pt-120">
      <div className="tg-location-su-bg">
        <Image src={location_bg} alt="" />
      </div>

      <div className="container">
        {/* Heading + Arrows */}
        <div className="row align-items-center">
          <div className="col-lg-9">
            <div className="tg-location-section-title mb-30">
              <h5
                className="tg-section-su-subtitle mb-15 wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                Our Locations
              </h5>
              <h2
                className="tg-section-su-title wow fadeInUp"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                Australia-wide opportunities, at your fingertips
              </h2>
            </div>
          </div>

          <div className="col-lg-3">
            <div
              className="tg-listing-5-slider-navigation tg-location-su-slider-navigation text-end mb-30 wow fadeInUp"
              data-wow-delay=".4s"
              data-wow-duration="1s"
            >
              {/* SAME DESIGN, sirf onClick add kiya hai */}
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
        <div className="row">
          <div className="col-12">
            {loading ? (
              <div>
                <h6>Loading...</h6>
              </div>
            ) : locationData.length === 0 ? (
              <div>
                <h6>No locations found.</h6>
              </div>
            ) : (
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Swiper
                  {...swiperOptions}
                  modules={[Autoplay]}
                  className="swiper-container tg-location-su-slider"
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                >
                  {locationData.map((item) => (
                    <SwiperSlide key={item.location_id} className="swiper-slide">
                      <div className="tg-location-3-wrap tg-location-su-wrap p-relative mb-30 tg-round-25">
                        <div className="tg-location-thumb tg-round-25">
                          <Image
                            className="w-100 tg-round-25"
                            src={`${item?.image}`}
                            alt="location"
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
                              {item?.name}
                            </h3>
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

export default OurLocation;
