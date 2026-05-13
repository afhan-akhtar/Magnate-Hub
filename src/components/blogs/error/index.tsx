import HeaderThree from "@/layouts/headers/HeaderThree";
import FooterFive from "@/layouts/footers/FooterFive";
import BreadCrumb from "@/components/common/BreadCrumb";

import Image, { StaticImageData } from "next/image";
import { JSX } from "react";
import Link from "next/link";
import { FaStore, FaUserCheck, FaMoneyBillTrendUp } from "react-icons/fa6";

import process_1 from "@/assets/img/chose/chose-2/thumb-1.jpg";
import process_2 from "@/assets/img/chose/chose-2/thumb-2.jpg";
import process_3 from "@/assets/img/chose/chose-2/thumb-3.jpg";
import shape from "@/assets/img/chose/chose-2/shape.png";
import HeaderOne from "@/layouts/headers/HeaderOne";

interface DataType {
  id: number;
  thumb?: StaticImageData;
  icon?: JSX.Element;
  title?: string;
  desc?: string;
}

const process_data: DataType[] = [
  { id: 1, thumb: process_1 },
  {
    id: 2,
    icon: <FaStore />,
    title: "Increased Visibility",
    desc: "With our premium package, your business listing/advert will be prominently displayed in our directory, increasing the chances of it being seen by potential buyers.",
  },
  { id: 3, thumb: process_2 },
  {
    id: 4,
    icon: <FaUserCheck />,
    title: "Targeted Audience",
    desc: "Our directory is specifically designed to reach Private Equity Firms, Venture Capitalists, Investors, and elite business personnel, ensuring that your listing is seen by the right people.",
  },
  { id: 5, thumb: process_3 },
  {
    id: 6,
    icon: <FaMoneyBillTrendUp />,
    title: "Faster Sales",
    desc: "By reaching a targeted audience, you'll increase the chances of a swift and successful sale. Our premium package will help you get your business in front of the right people at the right time.",
  },
];

const ProcessPage = () => {
  return (
    <>
      <HeaderOne />

      <main>
        <BreadCrumb title="Premium Packages" sub_title="" />

        <div className="tg-chose-area tg-chose-su-wrap pt-100 pb-105 p-relative z-index-9">
          <Image
            className="tg-chose-2-shape d-none d-lg-block"
            src={shape}
            alt="shape"
          />

          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="tg-chose-section-title text-center mb-40">
                  {/* <h5 className="tg-section-su-subtitle su-subtitle-2 mb-20">Discover Our Features</h5> */}
                  {/*             
                  <p className="tg-section-su-para">
                    Explore how Magnate Hub simplifies business buying, selling, and funding.
                  </p> */}

                  <p className="tg-section-su-para">
                    Introducing Magnate Hub's Premium Package - the ultimate
                    solution for business owners looking to sell their business.
                    With this package, your business listing will be directly
                    sent to a curated list of Private Equity Firms, Venture
                    Capitalists, Investors, and elite business personnel who are
                    actively searching for new investment opportunities.
                  </p>

                  <p className="tg-section-su-para">
                    This means that if your business aligns with their
                    interests, you could receive a purchase offer swiftly and
                    efficiently. Our premium package provides maximum exposure
                    for your business and accelerates the buying and selling
                    process.
                  </p>

                  <p className="tg-section-su-para">
                    Enjoy no commissions, unlimited access to edit your listing,
                    and a dedicated consultation with our experts to evaluate
                    your business opportunities. Our team will write, list, and
                    manage your investment opportunities for you, ensuring
                    maximum visibility and engagement. Your listings will remain
                    active until you find the perfect match, and you can choose
                    to invest in businesses on your own or with the help of our
                    brokers. Please note, if you choose a broker to help with
                    your sale, you may be liable to pay a commission to them.
                    Magnate Hub does not take any commissions by placing an
                    advert on our platform.
                  </p>

                  <p className="tg-section-su-para">
                    The package also includes a free non-disclosure document, a
                    statistics dashboard to track your progress, and a chat
                    feature to connect with potential business owners, sellers
                    and partners. With the Premium Package, you have everything
                    you need to take your investment portfolio to new heights
                    and get in front of the right people.
                  </p>

                  <h2 className="tg-section-su-title mb-15">
                    4 great reasons why they should purchase the premium package
                  </h2>
                  <p className="tg-section-su-para">
                    Here are 4 great reasons why you should purchase the premium
                    package:
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              {process_data.map((item) =>
                item.thumb ? (
                  <div
                    key={item.id}
                    className="col-lg-4 col-md-6 col-sm-6 mb-25"
                  >
                    <Image
                      className="w-100 h-100"
                      src={item.thumb}
                      alt="process-thumb"
                    />
                  </div>
                ) : (
                  <div
                    key={item.id}
                    className="col-lg-4 col-md-6 col-sm-6 mb-25 text-center"
                  >
                    <div className="tg-chose-2-icon mb-20 fs-1 text-primary">
                      {item.icon}
                    </div>
                    <h4 className="tg-chose-2-title mb-15">
                      <Link href="/contact">{item.title}</Link>
                    </h4>
                    <p>{item.desc}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>

      <FooterFive />
    </>
  );
};

export default ProcessPage;
