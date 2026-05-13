"use client";

import BreadCrumb from "@/components/common/BreadCrumb";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";

import Image, { StaticImageData } from "next/image";
import { JSX } from "react";

import {
  FaCheckCircle,
  FaIndustry,
  FaSlidersH,
  FaComments,
  FaChartLine,
  FaBan,
} from "react-icons/fa";

import process_1 from "@/assets/img/imgs/high.png";
import process_2 from "@/assets/img/imgs/wide.png";
import process_3 from "@/assets/img/imgs/filter.png";
import process_4 from "@/assets/img/imgs/direct.png";
import process_6 from "@/assets/img/imgs/comm.png";

interface DataType {
  id: number;
  thumb: StaticImageData;
  icon: JSX.Element;
  title: string;
  desc: string;
}

const process_data: DataType[] = [
  {
    id: 1,
    icon: <FaCheckCircle size={34} color="#631ee5" />,
    title: "High-quality opportunities",
    desc: "Magnate Hub is home to a diverse range of high-quality businesses and startups. Our rigorous vetting process ensures that only the best opportunities are listed on our platform, giving investors the confidence that they are making a sound investment.",
    thumb: process_1,
  },
  {
    id: 2,
    icon: <FaIndustry size={34} color="#631ee5" />,
    title: "Wide range of industries",
    desc: "Magnate Hub offers a wide range of investment opportunities across different industries. From technology and healthcare to food and fashion, our platform has something for every investor.",
    thumb: process_2,
  },
  {
    id: 3,
    icon: <FaSlidersH size={34} color="#631ee5" />,
    title: "Customizable filters",
    desc: "Our platform allows investors to customize their search for investment opportunities based on factors such as industry, location, and stage of development. This makes it easy for investors to find the right opportunity to match their investment criteria.",
    thumb: process_3,
  },
  {
    id: 4,
    icon: <FaComments size={34} color="#631ee5" />,
    title: "Direct communication",
    desc: "Magnate Hub offers a built-in messaging system that allows investors to directly communicate with entrepreneurs and startups. This makes it easy for investors to ask questions, request additional information, and negotiate deals.",
    thumb: process_4,
  },
  {
    id: 6,
    icon: <FaBan size={34} color="#631ee5" />,
    title: "No commissions",
    desc: "Unlike other platforms, Magnate Hub does not charge any commission on investment deals. This means that investors can keep more of their returns for themselves.",
    thumb: process_6,
  },
];

const Process = () => {
  return (
    <>
      <HeaderOne />

      <main>
        <BreadCrumb title="Investment Opportunities" sub_title="" />

        <div className="tg-chose-area tg-grey-bg pt-140 pb-70 p-relative z-index-1">
          <div className="container-fluid px-5">
            {/* Title */}
            <div className="row justify-content-center">
              <div className="col-xl-8 col-lg-9 col-md-10">
                <div className="tg-chose-section-title text-center mb-50">

                  <h2 className="mb-15 ">Investment Opportunities</h2>

                  <p style={{ maxWidth: 880, margin: "0 auto" }}>
                    Welcome to Magnate Hub, the premier platform for connecting
                    entrepreneurs and startups with investors. Our platform
                    offers a wide range of benefits for investors looking to
                    grow their portfolios and find the next big opportunity.
                    Here are just a few reasons why Magnate Hub is great for
                    investors.
                  </p>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="row g-4 gy-4 justify-content-center">
              {process_data.map((item) => (
                <div key={item.id} className="col-xl-4 col-lg-4 col-md-6">
                  <div className="mh-feature-card h-100 d-flex flex-column">
                    {/* Image */}
                    <div className="mh-feature-media">
                      <Image
                        src={item.thumb}
                        alt={item.title}
                        className="mh-feature-img"
                        priority={item.id <= 3}
                      />
                    </div>

                    {/* Icon */}
                    <div className="mh-feature-icon">{item.icon}</div>

                    {/* Body */}
                    <div className="mh-feature-body">
                      <h4 className="mh-feature-title">{item.title}</h4>
                      <p className="mh-feature-desc">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Styles */}
            <style jsx>{`
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
                object-position: top;
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

export default Process;
