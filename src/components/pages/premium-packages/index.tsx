"use client";

import BreadCrumb from "@/components/common/BreadCrumb";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";

import Image, { StaticImageData } from "next/image";
import { JSX } from "react";

import {
  FaStore,
  FaUserCheck,
  FaMoneyBillTrendUp,
  FaRocket,

  // ✅ icons for 4 reasons section
  FaBullhorn,
  FaHandHoldingDollar,
  FaUserTie,
  FaGears,
} from "react-icons/fa6";

import process_1 from "@/assets/img/imgs/increae.png";
import process_4 from "@/assets/img/imgs/target.png";
import process_3 from "@/assets/img/imgs/faster.png";
import process_2 from "@/assets/img/imgs/greater.png";
import process_5 from "@/assets/img/imgs/intro.png";

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
    icon: <FaStore size={34} color="#631ee5" />,
    title: "Increased Visibility",
    desc: "With our premium package, your business listing/advert will be prominently displayed in our directory, increasing the chances of it being seen by potential buyers.",
  },
  { id: 3, thumb: process_2 },
  {
    id: 4,
    icon: <FaUserCheck size={34} color="#631ee5" />,
    title: "Targeted Audience",
    desc: "Our directory is specifically designed to reach Private Equity Firms, Venture Capitalists, Investors, and elite business personnel, ensuring that your listing is seen by the right people.",
  },
  { id: 5, thumb: process_3 },
  {
    id: 6,
    icon: <FaMoneyBillTrendUp size={34} color="#631ee5" />,
    title: "Faster Sales",
    desc: "By reaching a targeted audience, you'll increase the chances of a swift and successful sale. Our premium package will help you get your business in front of the right people at the right time.",
  },
  { id: 7, thumb: process_4 },
  {
    id: 8,
    icon: <FaRocket size={34} color="#631ee5" />,
    title: "Greater Exposure",
    desc: "With our premium package, you'll have the opportunity to reach a wider audience than with a standard listing. This will help you reach more potential buyers and increase your chances of a successful sale.",
  },
];

const ProcessPage = () => {
  const reasons = [
    {
      icon: <FaBullhorn size={26} color="#631ee5" />,
      title: "Maximum Exposure",
      desc: "Your business gets visibility among elite investors, PE firms, and VCs actively seeking opportunities.",
    },
    {
      icon: <FaHandHoldingDollar size={26} color="#631ee5" />,
      title: "No Commissions",
      desc: "Keep 100% of your profit. Magnate Hub doesn’t take any commission from your sale listings.",
    },
    {
      icon: <FaUserTie size={26} color="#631ee5" />,
      title: "Dedicated Consultation",
      desc: "Get expert support to evaluate your business and optimize your listing for maximum engagement.",
    },
    {
      icon: <FaGears size={26} color="#631ee5" />,
      title: "Powerful Tools",
      desc: "Access a stats dashboard, free NDA, and chat tools to connect with potential buyers and investors.",
    },
  ];

  const pairs = process_data.reduce(
    (acc: Array<{ img: StaticImageData; content: DataType }>, cur, i) => {
      if (cur.thumb && process_data[i + 1]?.icon) {
        acc.push({ img: cur.thumb, content: process_data[i + 1] });
      }
      return acc;
    },
    []
  );

  return (
    <>
      <HeaderOne />

      <main>
        <BreadCrumb title="Premium Packages" sub_title="" />

        <div className="tg-chose-area tg-grey-bg pt-140 pb-70 p-relative z-index-1">
          <div className="container">
            {/* Intro Section */}
            <div className="row align-items-center justify-content-center mb-60">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="mh-hero-media">
                  <Image
                    className="mh-hero-img"
                    src={process_5}
                    alt="Premium Package"
                    priority
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="tg-chose-section-title">
                  <h2 className="mb-15 ">
                    Introducing Magnate Hub&apos;s Premium Package
                  </h2>
                  <p style={{ lineHeight: 1.9, color: "#555" }}>
                    The ultimate solution for business owners looking to sell
                    their business. With this package, your business listing
                    will be directly sent to a curated list of Private Equity
                    Firms, Venture Capitalists, Investors, and elite business
                    personnel actively searching for new investment
                    opportunities.
                  </p>
                  <p style={{ lineHeight: 1.9, color: "#555" }}>
                    This means that if your business aligns with their
                    interests, you could receive a purchase offer swiftly and
                    efficiently. Our premium package provides maximum exposure
                    for your business and accelerates the buying and selling
                    process.
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Reasons */}
            <div className="row justify-content-center">
              <div className="col-xl-10 col-lg-11">
                <div className="text-center mb-35">
                  <h2 className="mb-0 ">
                    4 Great Reasons Why You Should Purchase the Premium Package
                  </h2>
                </div>
              </div>
            </div>

            <div className="row g-4 gy-4 mb-70">
              {reasons.map((c, idx) => (
                <div key={idx} className="col-md-6 col-lg-3">
                  <div className="mh-mini-card h-100">
                    <div className="mh-mini-icon">{c.icon}</div>
                    <h5 className="mh-mini-title">{c.title}</h5>
                    <p className="mh-mini-desc">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Benefits */}
            <div className="row justify-content-center">
              <div className="col-xl-10 col-lg-11">
                <div className="text-center mb-35">
                  <h2 className="mb-0 ">Premium Benefits</h2>
                </div>
              </div>
            </div>

            <div className="row g-4 gy-4 justify-content-center">
              {pairs.map((pair, index) => (
                <div key={index} className="col-xl-4 col-lg-4 col-md-6">
                  <div className="mh-feature-card h-100 d-flex flex-column">
                    <div className="mh-feature-media">
                      <Image
                        src={pair.img}
                        alt={pair.content.title || "premium-feature"}
                        className="mh-feature-img"
                        priority={index < 3}
                      />
                    </div>

                    <div className="mh-feature-icon">{pair.content.icon}</div>

                    <div className="mh-feature-body">
                      <h4 className="mh-feature-title">{pair.content.title}</h4>
                      <p className="mh-feature-desc">{pair.content.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Styles */}
            <style jsx>{`
              .mh-hero-media {
                border-radius: 24px;
                overflow: hidden;
                background: #fff;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
              }

              :global(.mh-hero-img) {
                width: 100%;
                height: auto;
                display: block;
                object-fit: cover;
              }

              /* 4 reasons cards */
              .mh-mini-card {
                background: #fff;
                border-radius: 20px;
                padding: 26px 22px 24px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
                position: relative;
                transition: all 0.35s ease;
                overflow: hidden;
              }

              .mh-mini-card::before {
                content: "";
                position: absolute;
                inset: 0;
                padding: 1px;
                border-radius: 20px;
                background: linear-gradient(
                  135deg,
                  rgba(99, 30, 229, 0.22),
                  rgba(255, 255, 255, 0.6),
                  rgba(99, 30, 229, 0.12)
                );
                -webkit-mask: linear-gradient(#000 0 0) content-box,
                  linear-gradient(#000 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                pointer-events: none;
              }

              .mh-mini-icon {
                width: 48px;
                height: 48px;
                border-radius: 14px;
                background: linear-gradient(135deg, #f2edff, #ffffff);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 18px rgba(99, 30, 229, 0.14);
                margin: 0 0 14px;
              }

              .mh-mini-title {
                font-weight: 800;
                margin: 0 0 10px;
              }

              .mh-mini-desc {
                margin: 0;
                line-height: 1.9;
                color: #555;
              }

              .mh-mini-card:hover {
                transform: translateY(-6px);
                box-shadow: 0 18px 55px rgba(99, 30, 229, 0.14);
              }

              /* premium benefit cards */
              .mh-feature-card {
                background: #fff;
                border-radius: 24px;
                overflow: hidden;
                transition: all 0.35s ease;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
                position: relative;
              }

              .mh-feature-card::before {
                content: "";
                position: absolute;
                inset: 0;
                padding: 1px;
                border-radius: 24px;
                background: linear-gradient(
                  135deg,
                  rgba(99, 30, 229, 0.22),
                  rgba(255, 255, 255, 0.6),
                  rgba(99, 30, 229, 0.12)
                );
                -webkit-mask: linear-gradient(#000 0 0) content-box,
                  linear-gradient(#000 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                pointer-events: none;
              }

              .mh-feature-media {
                height: 300px;
                overflow: hidden;
              }

              :global(.mh-feature-img) {
                width: 100%;
                height: 300px;
                object-fit: cover;
                display: block;
                transition: transform 0.6s ease;
              }

              .mh-feature-icon {
                width: 72px;
                height: 72px;
                border-radius: 18px;
                background: linear-gradient(135deg, #f2edff, #ffffff);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: -36px auto 18px;
                box-shadow: 0 8px 20px rgba(99, 30, 229, 0.18);
                position: relative;
                z-index: 1;
              }

              .mh-feature-body {
                padding: 0 36px 42px;
                text-align: center;
                flex: 1;
              }

              .mh-feature-title {
                font-weight: 800;
                line-height: 1.25;
                margin: 0 0 14px;
              }

              .mh-feature-desc {
                margin: 0;
                line-height: 1.9;
                color: #555;
              }

              .mh-feature-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 18px 55px rgba(99, 30, 229, 0.18);
              }

              .mh-feature-card:hover :global(.mh-feature-img) {
                transform: scale(1.06);
              }

              @media (max-width: 575px) {
                .mh-feature-body {
                  padding: 0 22px 34px;
                }
                .mh-feature-media {
                  height: 210px;
                }
                :global(.mh-feature-img) {
                  height: 210px;
                }
              }
            `}</style>
          </div>
        </div>
      </main>

      <FooterOne />
    </>
  );
};

export default ProcessPage;
