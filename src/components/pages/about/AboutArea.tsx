import Image from "next/image";
import Button from "@/components/common/Button";
import Link from "next/link";
import thumb_1 from "@/assets/img/imgs/aboutus.png";

const AboutArea = () => {
  return (
    <div className="tg-about-area p-relative z-index-1 pt-140 pb-105">
      {/* <Image
        className="tg-about-details-shape p-absolute d-none d-lg-block"
        src={shape_1}
        alt="shape"
      /> */}
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="tg-about-details-left p-relative mb-15">
              <div className="tg-about-details-thumb p-relative z-index-9">
                <Image
                  className="main-thumb tg-round-15 w-100 mb-20"
                  src={thumb_1}
                  alt="thumb"
                  style={{
                    objectFit: "cover",
                    height: "100%",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="tg-chose-content mb-35 ml-60">
              <div className="tg-chose-section-title mb-30">
                <h5
                  className="tg-section-subtitle mb-15 wow fadeInUp"
                  data-wow-delay=".3s"
                  data-wow-duration=".1s"
                >
                  About Us
                </h5>
                <h2
                  className="mb-15 wow fadeInUp"
                  data-wow-delay=".4s"
                  data-wow-duration=".9s"
                >
                  Success usually comes to those who are busy to be looking for
                  it
                </h2>
                <p
                  className="wow fadeInUp mb-35"
                  data-wow-delay=".5s"
                  data-wow-duration=".9s"
                >
                  Welcome to Magnate Hub, your premier destination for
                  professional business transactions. We&apos;re here to connect
                  entrepreneurs, investors, and business owners in a dynamic
                  marketplace designed to facilitate buying, selling, and
                  capital-raising endeavors.
                  <br /> Our user-friendly platform streamlines the process,
                  making it effortless for businesses to find buyers, and for
                  sellers to connect with qualified agents. With Magnate Hub,
                  you can confidently trade your business online, unlocking a
                  world of opportunities.
                </p>
                {/* <div
                  className="tg-chose-btn wow fadeInUp"
                  data-wow-delay=".8s"
                  data-wow-duration=".9s"
                >
                  <Link
                    href="/about"
                    className="tg-btn tg-btn-switch-animation"
                  >
                    <Button text="More About Us" />
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutArea;
