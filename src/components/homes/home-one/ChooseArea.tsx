"use client";

import Image from "next/image";
import { JSX } from "react";

import choose_thumb1 from "@/assets/img/imgs/opportunity1.png";
import choose_thumb2 from "@/assets/img/imgs/opportunity2.png";
import choose_thumb3 from "@/assets/img/imgs/opportunity3.png";

import {
  FaChartLine,
  FaUserTie,
  FaHandshake,
  FaUserPlus,
} from "react-icons/fa6";

interface DataType {
  id: number;
  icon: JSX.Element;
  title: string;
  desc: string;
}

const choose_data: DataType[] = [
  {
    id: 1,
    icon: <FaChartLine size={26} color="#631ee5" />,
    title: "10,000+",
    desc: "Monthly Web Visits",
  },
  {
    id: 2,
    icon: <FaUserTie size={26} color="#631ee5" />,
    title: "250+",
    desc: "Active Investors",
  },
  {
    id: 3,
    icon: <FaHandshake size={26} color="#631ee5" />,
    title: "$2,500,000+",
    desc: "Deals Successfully Closed",
  },
  {
    id: 4,
    icon: <FaUserPlus size={26} color="#631ee5" />,
    title: "3,000+",
    desc: "Registered Members",
  },
];

const ChooseArea = () => {
  return (
    <div className="tg-chose-area pt-140 pb-130 p-relative z-index-1">
      <div className="container">
        {/* Header */}
        <div className="row align-items-end mb-45">
          <div className="col-lg-7">
            <div className="tg-chose-section-title">
              <h5 className="tg-section-subtitle mb-15">Our Achievement</h5>
              <h2 className="mb-0 ">
                Building connections that create opportunities
              </h2>
            </div>
          </div>

          <div className="col-lg-5">
            <p
              className="mb-0 mt-3 mt-lg-0"
              style={{ lineHeight: 1.9, color: "#555" }}
            >
              Magnate Hub may be new in the market, but we’re already driving
              real success. Our platform actively connects entrepreneurs,
              investors, and business owners—helping them close deals, raise
              capital, and achieve growth faster than ever before.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="row g-4 align-items-stretch">
          {/* Left Images */}
          <div className="col-lg-7">
            <div className=" h-100">
              <div className="row g-3">
                <div className="col-md-5">
                  <div className="mh-stack">
                    <div className="mh-imgWrap">
                      <Image
                        src={choose_thumb1}
                        alt="Achievement image 1"
                        className="mh-img"
                        priority
                      />
                    </div>
                    <div className="mh-imgWrap">
                      <Image
                        src={choose_thumb2}
                        alt="Achievement image 2"
                        className="mh-img"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-7">
                  <div className="mh-imgWrap mh-imgTall">
                    <Image
                      src={choose_thumb3}
                      alt="Achievement image 3"
                      className="mh-img"
                    />
                  </div>
                </div>
              </div>

              {/* subtle bottom fade like premium cards */}
              <div className="mh-mediaGlow" />
            </div>
          </div>

          {/* Right Stats */}
          <div className="col-lg-5">
            <div className=" h-100">
              <div className="row g-3">
                {choose_data.map((item) => (
                  <div key={item.id} className="col-12">
                    <div className="mh-statItem">
                      <div className="mh-statIcon">{item.icon}</div>

                      <div className="mh-statText">
                        <div className="mh-statTitle">{item.title}</div>
                        <div className="mh-statDesc">{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Styles (scoped) */}
        <style jsx>{`
          /* Shared */

          /* Images */
          .mh-mediaCard {
            padding: 16px;
          }

          .mh-stack {
            display: grid;
            gap: 12px;
          }

          .mh-imgWrap {
            border-radius: 18px;
            overflow: hidden;
            height: 190px;
            background: #f6f6ff;
          }

          .mh-imgTall {
            height: 392px;
          }

          :global(.mh-img) {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.6s ease;
          }

          .mh-mediaCard:hover :global(.mh-img) {
            transform: scale(1.03);
          }

          .mh-mediaGlow {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 90px;
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(99, 30, 229, 0.06) 100%
            );
            pointer-events: none;
          }

          /* Stats */
          .mh-statsCard {
            padding: 26px;
          }

          .mh-statsHeader {
            margin-bottom: 18px;
          }

          .mh-statItem {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 16px 16px;
            border-radius: 18px;

            transition: all 0.35s ease;
          }

          .mh-statIcon {
            width: 52px;
            height: 52px;
            border-radius: 16px;
            background: linear-gradient(135deg, #f2edff, #ffffff);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 20px rgba(99, 30, 229, 0.12);
            flex: 0 0 auto;
          }

          .mh-statTitle {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1;
            letter-spacing: -0.5px;
            color: #0b0b0b;
          }

          .mh-statDesc {
            margin-top: 6px;
            font-size: 16px;
            color: #555;
            line-height: 1.4;
          }

          .mh-statsHint {
            margin-top: 16px;
            padding-top: 14px;
            border-top: 1px solid rgba(99, 30, 229, 0.12);
            color: #666;
            font-size: 14px;
          }

          @media (max-width: 991px) {
            .mh-imgTall {
              height: 380px;
            }
          }

          @media (max-width: 575px) {
            .mh-statsCard {
              padding: 20px;
            }
            .mh-statTitle {
              font-size: 34px;
            }
            .mh-imgWrap {
              height: 180px;
            }
            .mh-imgTall {
              height: 340px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ChooseArea;
