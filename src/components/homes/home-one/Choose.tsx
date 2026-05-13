import Image from "next/image";
import Button from "@/components/common/Button";
import choose_thumb2 from "@/assets/img/imgs/about.png";
import Link from "next/link";

const Choose = () => {
  return (
    <div className="tg-chose-area p-relative pt-135 pb-100">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div className="tg-chose-content mb-25">
              <div className="tg-chose-section-title mb-30">
                <h5
                  className="tg-section-subtitle mb-15 wow fadeInUp"
                  data-wow-delay=".3s"
                  data-wow-duration=".1s"
                >
                  About us
                </h5>
                <h2
                  className="mb-15 wow fadeInUp"
                  data-wow-delay=".4s"
                  data-wow-duration=".9s"
                >
                  The hub of all hubs
                </h2>
                <p
                  className="wow fadeInUp"
                  data-wow-delay=".5s"
                  data-wow-duration=".9s"
                >
                  Magnate Hub is the ultimate platform for entrepreneurs and
                  business owners. Whether you&apos;re looking to buy or sell a
                  business, find investors, or raise capital, we&apos;ve got you
                  covered.
                </p>
                <p
                  className="wow fadeInUp"
                  data-wow-delay=".5s"
                  data-wow-duration=".9s"
                >
                  With a user-friendly interface and a vast network of potential
                  buyers, sellers, investors, and lenders, Magnate Hub makes it
                  easy to take your business to the next level.
                </p>
              </div>
              {/* <div className="tg-chose-list-wrap">
                <div
                  className="tg-chose-btn wow fadeInUp"
                  data-wow-delay=".8s"
                  data-wow-duration=".9s"
                >
                    <Link
                      href="/about"
                      className="tg-btn tg-btn-switch-animation"
                    >
                      <Button text="More About us" />
                    </Link>
                </div>
              </div> */}
            </div>
          </div>

          <div className="col-lg-7">
            <div className="tg-chose-right mb-25">
              <div className="tg-chose-thumb-inner p-relative">
                <div
                  className="tg-chose-thumb-2 wow fadeInRight"
                  data-wow-delay=".5s"
                  data-wow-duration=".9s"
                >
                  <Image
                    className=" tg-round-15"
                    src={choose_thumb2}
                    alt="chose"
                    style={{
                      width: "100%",
                      height: "500px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* <div className="col-lg-2">
                  <div className="tg-chose-big-text d-none d-xl-block">
                    <h2 data-text="ABOUT">ABOUT</h2>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;
