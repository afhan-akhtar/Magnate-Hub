import Image from "next/image";

import about_thumb1 from "@/assets/img/imgs/missions.png";

const About = () => {
  return (
    <div className="tg-about-area pt-100">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4">
            <div className="tg-about-thumb-wrap mb-30">
              <Image
                className="w-100 tg-round-15 mb-85 wow fadeInLeft"
                data-wow-delay=".3s"
                data-wow-duration=".7s"
                src={about_thumb1}
                alt="about"
                style={{ objectFit: "cover", height: "100%" }}
              />
            </div>
          </div>
          <div className="col-lg-8 mb-30">
            <div className="tg-about-content text-start">
              <div className="tg-about-section-title mb-25">
                <h5
                  className="tg-section-subtitle wow fadeInUp"
                  data-wow-delay=".4s"
                  data-wow-duration=".6s"
                >
                  About us
                </h5>
                <h2
                  className="mb-15 wow fadeInUp"
                  data-wow-delay=".5s"
                  data-wow-duration=".7s"
                >
                  Our Mission
                </h2>
                <p
                  className="wow fadeInUp"
                  data-wow-delay=".6s"
                  data-wow-duration=".8s"
                >
                  At Magnate Hub, our mission is to empower businesses of all
                  sizes to achieve their goals and connect them with the
                  resources they need to thrive. In an industry where finding a
                  one-stop-shop can be challenging, we proudly offer a
                  comprehensive platform that not only facilitates buying and
                  selling businesses but also provides a dedicated space for
                  individuals seeking capital raisers.
                </p>
                <p
                  className="wow fadeInUp"
                  data-wow-delay=".6s"
                  data-wow-duration=".8s"
                >
                  We understand that it's often difficult to be heard in the
                  crowded marketplace of investment opportunities. That's why
                  Magnate Hub goes the extra mile to ensure that pitchers have a
                  platform to showcase their vision and secure the necessary
                  funding. We have cultivated a vast network of investors
                  actively seeking their next big project, providing a unique
                  opportunity for entrepreneurs to find the support and
                  financial backing they need to turn their dreams into reality.
                </p>
                <p
                  className="wow fadeInUp"
                  data-wow-delay=".6s"
                  data-wow-duration=".8s"
                >
                  With Magnate Hub, we're not just simplifying business
                  transactions; we're forging connections, fostering innovation,
                  and ensuring that everyone, from small local businesses to
                  ambitious startups, has the chance to make their mark in the
                  world of entrepreneurship. Join us today and experience the
                  difference of a platform that truly understands and supports
                  your business aspirations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
