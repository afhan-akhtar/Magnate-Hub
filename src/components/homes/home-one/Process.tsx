import Image, { StaticImageData } from "next/image";
import { JSX } from "react";
import Link from "next/link";
import { FaStore, FaUserCheck, FaMoneyBillTrendUp } from "react-icons/fa6";

import process_1 from "@/assets/img/imgs/marketplace.png";
import process_2 from "@/assets/img/imgs/friendly.png";
import process_3 from "@/assets/img/imgs/capital.png";
interface DataType {
  id: number;
  thumb?: StaticImageData;
  icon?: JSX.Element;
  title?: string;
  desc?: string;
}

const process_data: DataType[] = [
  {
    id: 1,
    thumb: process_2,
  },
  {
    id: 2,
    icon: <FaStore />,
    title: "Extensive Marketplace",
    desc: "Our platform boasts a diverse range of businesses available for sale and investment opportunities. From small local enterprises to large-scale ventures, you'll find a wide selection of options.",
  },
  {
    id: 3,
    thumb: process_3,
  },
  {
    id: 4,
    icon: <FaUserCheck />,
    title: "User-Friendly Interface",
    desc: "We've designed our platform with simplicity in mind. Easily list your business for sale or search for potential acquisitions. Our intuitive tools ensure a seamless experience.",
  },
  {
    id: 5,
    thumb: process_1,
  },
  {
    id: 6,
    icon: <FaMoneyBillTrendUp />,
    title: "Capital Raising",
    desc: "If you're seeking capital to fuel your business growth, Magnate Hub is the ideal place to connect with investors interested in your industry.",
  },
];

const Process = () => {
  return (
    <div className="tg-chose-area tg-chose-su-wrap pt-100 pb-105 p-relative z-index-9">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="tg-chose-section-title text-center mb-40">
              <h5
                className="tg-section-su-subtitle su-subtitle-2 mb-20 wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                Discover Our Features
              </h5>
              <h2
                className="tg-section-su-title wow fadeInUp mb-15"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                Why Choose Magnate Hub
              </h2>
              <p
                className="tg-section-su-para tg-section-su-para-2 mb-10"
                data-wow-delay=".6s"
              >
                Explore how Magnate Hub simplifies business buying, selling, and
                funding through a seamless experience.
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {process_data.map((item) =>
            item.thumb ? (
              <div key={item.id} className="col-lg-4 col-md-6 col-sm-6 mb-25">
                <div
                  className="tg-chose-2-thumb h-100 wow fadeInLeft"
                  data-wow-delay=".4s"
                  data-wow-duration=".6s"
                >
                  <Image
                    className="w-100 h-100"
                    src={item.thumb}
                    alt="process-thumb"
                  />
                </div>
              </div>
            ) : (
              <div key={item.id} className="col-lg-4 col-md-6 col-sm-6 mb-25">
                <div
                  className="tg-chose-2-content p-relative text-center z-index-1 wow fadeInUp"
                  data-wow-delay=".4s"
                  data-wow-duration=".6s"
                >
                  <div
                    className="tg-chose-2-icon mb-20 fs-1"
                    style={{ color: "#560CE3" }}
                  >
                    {item.icon}
                  </div>
                  <h4 className="tg-chose-2-title mb-15">
                    <Link href="/contact">{item.title}</Link>
                  </h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Process;
