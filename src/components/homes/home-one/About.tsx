import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <div className="tg-about-area p-relative z-index-1 pb-80">
      <Image
        className="tg-about-su-right-shape d-none d-xl-block"
        src="https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-set-image-stock-isolated-object-icon-collection-137161298.jpg"
        alt=""
      />
      <div className="container pt-80">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div
              className="tg-about-su-thumb wow fadeInLeft"
              data-wow-delay=".4s"
              data-wow-duration=".6s"
            >
              <Image
                src="https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-set-image-stock-isolated-object-icon-collection-137161298.jpg"
                alt=""
              />
            </div>
          </div>
          <div className="col-lg-7">
            <div
              className="tg-about-su-content-wrap ml-80 mb-30 wow fadeInRight"
              data-wow-delay=".4s"
              data-wow-duration=".6s"
            >
              <div className="tg-location-section-title mb-30">
                <h5 className="tg-section-su-subtitle mb-15">Who we are</h5>
                <h2 className="tg-section-su-title mb-15">
                  The hub of all hubs
                </h2>
                <p className="tg-section-su-para mb-10">
                  Magnate Hub is the ultimate platform for entrepreneurs and
                  business owners. Whether you&apos;re looking to buy or sell a
                  business, find investors, or raise capital, we&apos;ve got you
                  covered.
                  <br />
                  With a user-friendly interface and a vast network of potential
                  buyers, sellers, investors, and lenders, Magnate Hub makes it
                  easy to take your business to the next level.
                </p>
              </div>
              <div className="tg-about-su-author-wrap">
                <div className="mr-30 mb-10">
                  <Link className="tg-btn tg-btn-hover" href="/about">
                    More About Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
