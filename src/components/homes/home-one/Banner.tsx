"use client";
import BannerFormOne from "@/components/common/banner-form/BannerFormOne";

const Banner = () => {
  return (
    <div
      className="tg-hero-area tg-hero-tu-wrapper include-bg"
      style={{
        backgroundImage: `linear-gradient(to right, rgb(0, 0, 0, 0.6), rgb(0, 0, 0, 0.6)),url(/assets/img/banner/banner.png)`,
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="tg-hero-content text-center">
              <div className="tg-hero-title-box mb-30">
                <h2
                  className="tg-hero-title wow fadeInUp text-uppercase"
                  data-wow-delay=".4s"
                  data-wow-duration=".5s"
                >
                  Find your next investment
                </h2>
                <p
                  className="text-white wow fadeInUp"
                  data-wow-delay=".4s"
                  data-wow-duration=".7s"
                >
                  Discover a wide range of business opportunities
                </p>
              </div>

              <div className=" mt-15">
                <BannerFormOne />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
