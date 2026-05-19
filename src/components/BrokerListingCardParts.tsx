"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { BACKEND_ORIGIN } from "@/api/axiosInstance";
import Location from "@/svg/home-one/Location";
import Wishlist from "@/svg/home-one/Wishlist";
import { getListingStatusMode } from "@/lib/listingStatus";
import {
  SoldListingCard,
  UnderOfferListingCard,
} from "@/components/ListingStatusCardParts";

export type BrokerListingItem = {
  id: number;
  project_id: number | string;
  url: string;
  category_name: string;
  name: string;
  title_image: string;
  price?: string | number;
  location_name?: string;
  user_company_name?: string;
  user_company_logo?: string;
  user_first_name?: string;
  user_last_name?: string;
  user_image?: string;
  tag?: string;
  sold?: string | number;
};

export const brokerStyles = {
  card: "magnet-broker-card",
  headerWrap: "magnet-broker-card__header-wrap",
  media: "magnet-broker-card__media",
  mediaImage: "magnet-broker-card__media-image",
  categoryOnImage: "magnet-broker-card__category",
  verifiedBadge: "magnet-broker-card__verified",
  body: "magnet-broker-card__body",
  listingId: "magnet-broker-card__listing-id",
  brokerBadge: "magnet-broker-card__broker-badge",
  title: "magnet-broker-card__title",
  footer: "magnet-broker-card__footer",
  priceTag: "magnet-broker-card__price",
  priceTagBg: "magnet-broker-card__price-bg",
  priceTagText: "magnet-broker-card__price-text",
  footerRight: "magnet-broker-card__footer-right",
  locationRow: "magnet-broker-card__location-row",
  locationText: "magnet-broker-card__location-text",
};

const formatListingPrice = (price?: string | number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
};

const getCompanyInitials = (value?: string) => {
  if (!value?.trim()) {
    return "MH";
  }

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const getBrokerDisplayName = (firstName?: string, lastName?: string) => {
  const parts = [firstName?.trim(), lastName?.trim()].filter(
    (part): part is string => Boolean(part && part.length > 0),
  );

  return parts.join(" ");
};

const resolveBackendAssetUrl = (path?: string) => {
  const value = path?.trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${BACKEND_ORIGIN}${value.startsWith("/") ? "" : "/"}${value}`;
};

export const BrokerListingStyles = () => (
  <style jsx global>{`
    .magnet-broker-card {
      --broker-purple: #5b21b6;
      --broker-purple-deep: #3b0764;
      --broker-purple-soft: #ede9fe;
      --broker-ease: cubic-bezier(0.22, 1, 0.36, 1);
      isolation: isolate;
      position: relative;
      background: linear-gradient(
        165deg,
        #ffffff 0%,
        #fdfbff 48%,
        #f8f5ff 100%
      ) !important;
      border: 1px solid rgba(139, 92, 246, 0.12) !important;
      border-radius: 28px !important;
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.9) inset,
        0 20px 50px -12px rgba(59, 7, 100, 0.14),
        0 8px 24px -8px rgba(76, 29, 149, 0.1) !important;
      overflow: visible !important;
      padding: 0 !important;
      transition:
        transform 0.35s var(--broker-ease),
        box-shadow 0.35s var(--broker-ease),
        border-color 0.35s var(--broker-ease) !important;
    }

    .magnet-broker-card::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: radial-gradient(
        120% 80% at 50% -20%,
        rgba(167, 139, 250, 0.12),
        transparent 55%
      );
      pointer-events: none;
      z-index: 0;
    }

    .magnet-broker-card:hover {
      transform: translateY(-6px);
      border-color: rgba(139, 92, 246, 0.22) !important;
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.95) inset,
        0 28px 60px -14px rgba(59, 7, 100, 0.2),
        0 12px 32px -10px rgba(124, 58, 237, 0.15) !important;
    }

    .magnet-broker-card:active {
      transform: translateY(-2px);
      transition-duration: 0.12s;
    }

    .magnet-broker-card:focus-visible {
      outline: 2px solid #8b5cf6;
      outline-offset: 3px;
    }

    .magnet-broker-card > * {
      position: relative;
      z-index: 1;
    }

    .magnet-broker-card__header-wrap {
      position: relative;
      z-index: 2;
      margin-bottom: 28px;
    }

    .magnet-broker-card__header-band {
      position: relative;
      display: flex;
      align-items: center;
      gap: 14px;
      min-height: 82px;
      padding: 18px 92px 24px 18px;
      border-radius: 28px 28px 0 0;
      overflow: hidden;
      background: linear-gradient(
        118deg,
        #14082e 0%,
        #2d1568 28%,
        #4c1d95 58%,
        #6d28d9 100%
      );
    }

    .magnet-broker-card__header-band::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.14) 0%,
        transparent 42%
      );
      pointer-events: none;
    }

    .magnet-broker-card__header-band::after {
      content: "";
      position: absolute;
      top: -40%;
      right: -8%;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: radial-gradient(
        circle,
        rgba(196, 181, 253, 0.35) 0%,
        transparent 70%
      );
      pointer-events: none;
    }

    .magnet-broker-card__company-logo {
      position: relative;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 999px;
      background: #ffffff;
      border: 2px solid rgba(255, 255, 255, 0.45);
      color: var(--broker-purple-deep);
      font-size: 15px;
      font-weight: 800;
      box-shadow:
        0 4px 14px rgba(15, 8, 40, 0.2),
        0 0 0 4px rgba(255, 255, 255, 0.08);
      transition: transform 0.35s var(--broker-ease);
    }

    .magnet-broker-card:hover .magnet-broker-card__company-logo {
      transform: scale(1.04);
    }

    .magnet-broker-card__company-logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .magnet-broker-card__header-text {
      position: relative;
      z-index: 1;
      min-width: 0;
      flex: 1;
    }

    .magnet-broker-card__company-name {
      display: block;
      overflow: hidden;
      color: #ffffff;
      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-shadow: 0 1px 8px rgba(0, 0, 0, 0.15);
    }

    .magnet-broker-card__broker-subtitle {
      display: block;
      margin-top: 4px;
      overflow: hidden;
      color: rgba(255, 255, 255, 0.82);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.25;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .magnet-broker-card__avatar-float {
      position: absolute;
      right: 20px;
      bottom: -28px;
      z-index: 5;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      overflow: visible;
      border: 3px solid #ffffff;
      border-radius: 999px;
      background: linear-gradient(145deg, #f5f3ff 0%, #ddd6fe 100%);
      color: var(--broker-purple-deep);
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.04em;
      box-shadow:
        0 14px 32px rgba(59, 7, 100, 0.22),
        0 0 0 1px rgba(139, 92, 246, 0.15);
      transition:
        transform 0.35s var(--broker-ease),
        box-shadow 0.35s var(--broker-ease);
    }

    .magnet-broker-card__avatar-media {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 999px;
    }

    .magnet-broker-card__avatar-status {
      position: absolute;
      right: 3px;
      bottom: 3px;
      z-index: 6;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: linear-gradient(180deg, #4ade80 0%, #22c55e 55%, #16a34a 100%);
      border: 2.5px solid #ffffff;
      box-shadow: 0 2px 8px rgba(22, 163, 74, 0.55);
      pointer-events: none;
    }

    .magnet-broker-card__avatar-float img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .magnet-broker-card__media {
      position: relative;
      width: calc(100% - 36px) !important;
      height: 228px !important;
      margin: 0 18px !important;
      overflow: hidden !important;
      border-radius: 22px !important;
      background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%) !important;
      box-shadow:
        inset 0 0 0 1px rgba(139, 92, 246, 0.08),
        0 8px 28px rgba(59, 7, 100, 0.08) !important;
      outline: none !important;
    }

    .magnet-broker-card__media-image {
      width: 100% !important;
      height: 228px !important;
      object-fit: cover !important;
      transform: scale(1.02);
      transition: transform 0.55s var(--broker-ease) !important;
    }

    .magnet-broker-card:hover .magnet-broker-card__media-image {
      transform: scale(1.07) !important;
    }

    .magnet-broker-card__media-overlay {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background: linear-gradient(
        180deg,
        rgba(20, 8, 46, 0.08) 0%,
        transparent 35%,
        transparent 55%,
        rgba(20, 8, 46, 0.18) 100%
      );
      border-radius: inherit;
    }

    .magnet-broker-card__wishlist-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 7;
      cursor: pointer;
      width: 46px;
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      border: none;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.8);
      box-shadow:
        0 8px 24px rgba(15, 8, 40, 0.12),
        0 0 0 1px rgba(0, 0, 0, 0.04);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition:
        transform 0.3s var(--broker-ease),
        background 0.3s ease,
        box-shadow 0.3s ease;
    }

    .magnet-broker-card__wishlist-btn:hover {
      transform: scale(1.08);
      background: #ffffff;
      box-shadow: 0 12px 28px rgba(76, 29, 149, 0.18);
    }

    .magnet-broker-card__wishlist-btn:active {
      transform: scale(0.96);
    }

    .magnet-broker-card__wishlist-btn--active {
      background: #fff1f2;
      border-color: rgba(225, 29, 72, 0.2);
    }

    .magnet-broker-card__category {
      position: absolute;
      left: 12px;
      bottom: 12px;
      z-index: 6;
      max-width: 56%;
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.9);
      color: var(--broker-purple-deep);
      font-size: 10.5px;
      font-weight: 700;
      line-height: 1.25;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 6px 20px rgba(59, 7, 100, 0.12);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition: transform 0.35s var(--broker-ease);
    }

    .magnet-broker-card:hover .magnet-broker-card__category {
      transform: translateY(-2px);
    }

    .magnet-broker-card__verified {
      position: absolute;
      right: 12px;
      bottom: 12px;
      z-index: 6;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 7px 12px 7px 10px;
      border-radius: 999px;
      background: linear-gradient(
        135deg,
        #34d399 0%,
        #10b981 50%,
        #059669 100%
      );
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: #ffffff;
      font-size: 9px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      white-space: nowrap;
      box-shadow: 0 6px 18px rgba(5, 150, 105, 0.4);
      transition: transform 0.35s var(--broker-ease);
    }

    .magnet-broker-card:hover .magnet-broker-card__verified {
      transform: translateY(-2px);
    }

    .magnet-broker-card__verified i {
      font-size: 10px;
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.15));
    }

    .magnet-broker-card__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 20px 22px 22px !important;
    }

    .magnet-broker-card__meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 14px;
      min-height: 30px;
    }

    .magnet-broker-card__listing-id {
      margin: 0;
      padding: 4px 10px;
      border-radius: 8px;
      background: rgba(139, 92, 246, 0.06);
      color: #8b5cf6;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      line-height: 1.2;
      white-space: nowrap;
    }

    .magnet-broker-card__broker-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 13px 6px 11px;
      border-radius: 999px;
      background: linear-gradient(
        135deg,
        rgba(237, 233, 254, 0.95) 0%,
        rgba(221, 214, 254, 0.98) 100%
      );
      border: 1px solid rgba(139, 92, 246, 0.22);
      color: var(--broker-purple-deep);
      font-size: 9px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(91, 33, 182, 0.08);
    }

    .magnet-broker-card__broker-badge i {
      font-size: 10px;
      opacity: 0.85;
    }

    .magnet-broker-card .tg-listing-card-title {
      margin: 0 0 18px !important;
      min-height: 44px;
    }

    .magnet-broker-card__title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: #1e1b4b !important;
      font-size: 21px !important;
      font-weight: 800 !important;
      letter-spacing: -0.045em !important;
      line-height: 1.22 !important;
      text-decoration: none;
      transition: color 0.25s ease;
    }

    .magnet-broker-card__footer {
      padding-top: 18px !important;
      margin-top: auto !important;
      border-top: 1px solid rgba(139, 92, 246, 0.1) !important;
    }

    .magnet-broker-card__footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }

    .magnet-broker-card__price {
      position: relative;
      display: inline-flex;
      align-items: center;
      min-width: 92px;
      min-height: 46px;
      padding: 11px 20px 11px 18px;
      color: #ffffff;
      border-radius: 16px 16px 8px 16px;
      overflow: hidden;
      box-shadow:
        0 8px 24px rgba(91, 33, 182, 0.35),
        0 2px 0 rgba(255, 255, 255, 0.2) inset;
      transition:
        transform 0.35s var(--broker-ease),
        box-shadow 0.35s var(--broker-ease);
    }

    .magnet-broker-card:hover .magnet-broker-card__price {
      transform: translateY(-2px);
      box-shadow:
        0 12px 28px rgba(91, 33, 182, 0.42),
        0 2px 0 rgba(255, 255, 255, 0.25) inset;
    }

    .magnet-broker-card__price-bg {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(
        135deg,
        #8b5cf6 0%,
        #7c3aed 40%,
        #6d28d9 100%
      );
    }

    .magnet-broker-card__price-bg::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.2) 0%,
        transparent 100%
      );
      border-radius: inherit;
    }

    .magnet-broker-card__price-text {
      position: relative;
      z-index: 1;
      font-size: 21px;
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 1;
    }

    .magnet-broker-card__price-label {
      position: relative;
      z-index: 1;
      display: block;
      margin-bottom: 1px;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.75;
    }

    .magnet-broker-card__footer-right {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      min-width: 0;
      flex: 0 1 56%;
    }

    .magnet-broker-card__location-row {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 7px;
      min-width: 0;
      padding: 8px 12px;
      border-radius: 12px;
      background: rgba(139, 92, 246, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.08);
      transition:
        background 0.25s ease,
        border-color 0.25s ease;
    }

    .magnet-broker-card:hover .magnet-broker-card__location-row {
      background: rgba(139, 92, 246, 0.09);
      border-color: rgba(139, 92, 246, 0.14);
    }

    .magnet-broker-card__location-row svg {
      color: #8b5cf6;
      flex: 0 0 auto;
    }

    .magnet-broker-card__location-text {
      min-width: 0;
      overflow: hidden;
      color: #64748b;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.3;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .magnet-broker-card__view-hint {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-top: 12px;
      color: #8b5cf6;
      font-size: 12px;
      font-weight: 600;
      opacity: 0;
      transform: translateY(4px);
      transition:
        opacity 0.3s ease,
        transform 0.3s var(--broker-ease);
    }

    .magnet-broker-card:hover .magnet-broker-card__view-hint {
      opacity: 1;
      transform: translateY(0);
    }

    .magnet-broker-card__view-hint i {
      font-size: 10px;
      transition: transform 0.3s var(--broker-ease);
    }

    .magnet-broker-card:hover .magnet-broker-card__view-hint i {
      transform: translateX(3px);
    }

    .magnet-broker-card .tg-listing-item-wishlist {
      top: 12px !important;
      right: 12px !important;
    }

    @media (hover: hover) and (pointer: fine) {
      .magnet-broker-card:hover .magnet-broker-card__avatar-float,
      .home-premium-broker-card:hover .magnet-broker-card__avatar-float,
      .listing-page-broker-card:hover .magnet-broker-card__avatar-float {
        transform: translateY(-3px) scale(1.03);
        box-shadow:
          0 18px 36px rgba(59, 7, 100, 0.26),
          0 0 0 1px rgba(139, 92, 246, 0.2);
      }

      .magnet-broker-card:hover .magnet-broker-card__title,
      .home-premium-broker-card:hover .home-premium-broker-title,
      .listing-page-broker-card:hover .listing-page-broker-title {
        color: var(--broker-purple) !important;
      }
    }

    @media (max-width: 575px) {
      .magnet-broker-card {
        border-radius: 24px !important;
      }

      .magnet-broker-card__header-band {
        border-radius: 24px 24px 0 0;
        padding-right: 84px;
      }

      .magnet-broker-card__company-name {
        font-size: 15px;
      }

      .magnet-broker-card__broker-subtitle {
        font-size: 12px;
      }

      .magnet-broker-card__title {
        font-size: 18px !important;
      }

      .magnet-broker-card__media {
        height: 200px !important;
      }

      .magnet-broker-card__media-image {
        height: 200px !important;
      }

      .magnet-broker-card__view-hint {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .magnet-broker-card,
      .magnet-broker-card__media-image,
      .magnet-broker-card__avatar-float,
      .magnet-broker-card__price,
      .magnet-broker-card__view-hint {
        transition: none !important;
      }

      .magnet-broker-card:hover {
        transform: none;
      }

      .magnet-broker-card:hover .magnet-broker-card__media-image {
        transform: scale(1.02) !important;
      }
    }
  `}</style>
);

type BrokerListingHeaderProps = {
  companyName: string;
  companyLogoUrl: string;
  companyInitials: string;
  hasCompanyName: boolean;
  companyLogoFailed: boolean;
  onCompanyLogoError: () => void;
  brokerName: string;
  brokerImageUrl: string;
  brokerInitials: string;
  brokerPhotoFailed: boolean;
  onBrokerPhotoError: () => void;
  avatarClassName?: string;
};

export const BrokerListingHeader = ({
  companyName,
  companyLogoUrl,
  companyInitials,
  hasCompanyName,
  companyLogoFailed,
  onCompanyLogoError,
  brokerName,
  brokerImageUrl,
  brokerInitials,
  brokerPhotoFailed,
  onBrokerPhotoError,
  avatarClassName = "",
}: BrokerListingHeaderProps) => {
  const showCompanyLogo = Boolean(companyLogoUrl) && !companyLogoFailed;
  const showBrokerPhoto = Boolean(brokerImageUrl) && !brokerPhotoFailed;
  const displayCompanyName = hasCompanyName ? companyName : "Magnate Hub";

  return (
    <div className={brokerStyles.headerWrap}>
      <div className="magnet-broker-card__header-band">
        <span className="magnet-broker-card__company-logo">
          {showCompanyLogo ? (
            <Image
              src={companyLogoUrl}
              alt={displayCompanyName}
              width={50}
              height={50}
              unoptimized
              onError={onCompanyLogoError}
            />
          ) : (
            <span>{companyInitials}</span>
          )}
        </span>
        <span className="magnet-broker-card__header-text">
          <span className="magnet-broker-card__company-name">
            {displayCompanyName}
          </span>
          {brokerName ? (
            <span className="magnet-broker-card__broker-subtitle">
              {brokerName}
            </span>
          ) : null}
        </span>
      </div>
      {(brokerName || brokerInitials) && (
        <span
          className={`magnet-broker-card__avatar-float ${avatarClassName}`.trim()}
        >
          <span className="magnet-broker-card__avatar-media">
            {showBrokerPhoto ? (
              <Image
                src={brokerImageUrl}
                alt={brokerName || "Broker"}
                width={60}
                height={60}
                unoptimized
                onError={onBrokerPhotoError}
              />
            ) : (
              <span>{brokerInitials}</span>
            )}
          </span>
          <span
            className="magnet-broker-card__avatar-status"
            aria-hidden
            title="Active broker"
          />
        </span>
      )}
    </div>
  );
};

type BrokerListingCardProps = {
  item: BrokerListingItem;
  detailHref: string;
  isInWishlist: boolean;
  onWishlistClick: (event: MouseEvent) => void;
  onCardClick: () => void;
  listingReferenceField?: "id" | "project_id";
  cardClassName?: string;
  mediaClassName?: string;
  wishlistClassName?: string;
  titleClassName?: string;
};

export const BrokerListingCard = ({
  item,
  detailHref,
  isInWishlist,
  onWishlistClick,
  onCardClick,
  listingReferenceField = "project_id",
  cardClassName = "",
  mediaClassName = "",
  wishlistClassName = "",
  titleClassName = "",
}: BrokerListingCardProps) => {
  const statusMode = getListingStatusMode(item);

  if (statusMode === "under_offer") {
    return (
      <UnderOfferListingCard
        item={item}
        detailHref={detailHref}
        isInWishlist={isInWishlist}
        onWishlistClick={onWishlistClick}
        onCardClick={onCardClick}
        listingReferenceField={listingReferenceField}
        cardClassName={cardClassName}
        wishlistClassName={wishlistClassName}
        titleClassName={titleClassName}
      />
    );
  }

  if (statusMode === "sold") {
    return (
      <SoldListingCard
        item={item}
        detailHref={detailHref}
        isInWishlist={isInWishlist}
        onWishlistClick={onWishlistClick}
        onCardClick={onCardClick}
        listingReferenceField={listingReferenceField}
        cardClassName={cardClassName}
        wishlistClassName={wishlistClassName}
        titleClassName={titleClassName}
      />
    );
  }

  const companyName = item?.user_company_name?.trim() || "";
  const companyLogoUrl = resolveBackendAssetUrl(item?.user_company_logo);
  const companyInitials = getCompanyInitials(companyName);
  const hasCompanyName = Boolean(companyName);
  const brokerName = getBrokerDisplayName(
    item?.user_first_name,
    item?.user_last_name,
  );
  const brokerInitials = getCompanyInitials(brokerName || companyName);
  const brokerImageUrl = resolveBackendAssetUrl(item?.user_image);
  const referenceId =
    listingReferenceField === "id" ? item.id : item.project_id;
  const listingCode = `MGH-${new Date().getFullYear()}-${referenceId}`;
  const [companyLogoFailed, setCompanyLogoFailed] = useState(false);
  const [brokerPhotoFailed, setBrokerPhotoFailed] = useState(false);
  const avatarClassName = titleClassName
    ? titleClassName.replace("-title", "-avatar-wrap")
    : "";

  useEffect(() => {
    setCompanyLogoFailed(false);
    setBrokerPhotoFailed(false);
  }, [item.id]);

  const displayCompanyName = hasCompanyName ? companyName : "Magnate Hub";

  return (
    <article
      className={`tg-listing-card-item tg-listing-su-card-item mb-25 ${brokerStyles.card} ${cardClassName}`.trim()}
      style={{
        cursor: "pointer",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onCardClick}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onCardClick();
        }
      }}
      aria-label={`${item.name} listing by ${brokerName || displayCompanyName}`}
    >
      <BrokerListingStyles />
      <BrokerListingHeader
        companyName={companyName}
        companyLogoUrl={companyLogoUrl}
        companyInitials={companyInitials}
        hasCompanyName={hasCompanyName}
        companyLogoFailed={companyLogoFailed}
        onCompanyLogoError={() => setCompanyLogoFailed(true)}
        brokerName={brokerName}
        brokerImageUrl={brokerImageUrl}
        brokerInitials={brokerInitials}
        brokerPhotoFailed={brokerPhotoFailed}
        onBrokerPhotoError={() => setBrokerPhotoFailed(true)}
        avatarClassName={avatarClassName}
      />

      <div
        className={`${brokerStyles.media} ${mediaClassName}`.trim()}
        style={{ position: "relative" }}
      >
        <Image
          className={`tg-card-border w-100 ${brokerStyles.mediaImage}`}
          src={`https://dash.magnatehub.au${item.title_image}`}
          alt={item?.name || "Listing image"}
          width={280}
          height={228}
          unoptimized
          onError={(e) => {
            e.currentTarget.src = "assets/img/notfound/image_notfound.png";
          }}
        />
        <div className="magnet-broker-card__media-overlay" aria-hidden />

        <button
          type="button"
          className={`magnet-broker-card__wishlist-btn ${wishlistClassName} ${isInWishlist ? "magnet-broker-card__wishlist-btn--active" : ""}`.trim()}
          onClick={(event) => {
            event.stopPropagation();
            onWishlistClick(event);
          }}
          aria-label={
            isInWishlist ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <Wishlist
            filled={isInWishlist}
            style={{
              color: isInWishlist ? "#e11d48" : "#64748b",
              display: "block",
              flex: "0 0 auto",
            }}
          />
        </button>

        <span className={brokerStyles.categoryOnImage} title={item.category_name}>
          {item.category_name}
        </span>

        <span className={brokerStyles.verifiedBadge}>
          <i className="fa-solid fa-circle-check" aria-hidden />
          Verified
        </span>
      </div>

      <div className={`tg-listing-card-content ${brokerStyles.body}`}>
        <div className="magnet-broker-card__meta-row">
          <p className={brokerStyles.listingId}>{listingCode}</p>
          <span className={brokerStyles.brokerBadge}>
            <i className="fa-solid fa-briefcase" aria-hidden />
            Broker
          </span>
        </div>

        <h4 className="tg-listing-card-title">
          <Link href={detailHref} onClick={(event) => event.stopPropagation()}>
            <span
              className={`${brokerStyles.title} ${titleClassName}`.trim()}
              title={item.name}
            >
              {item.name}
            </span>
          </Link>
        </h4>

        <div className={brokerStyles.footer}>
          <div className="magnet-broker-card__footer-inner">
            <span className={brokerStyles.priceTag}>
              <span className={brokerStyles.priceTagBg} aria-hidden />
              <span className={brokerStyles.priceTagText}>
                ${formatListingPrice(item.price)}
              </span>
            </span>

            {item.location_name ? (
              <div className={brokerStyles.footerRight}>
                <div className={brokerStyles.locationRow}>
                  <Location />
                  <span
                    className={brokerStyles.locationText}
                    title={item.location_name}
                  >
                    {item.location_name}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <span className="magnet-broker-card__view-hint" aria-hidden>
            View details
            <i className="fa-solid fa-arrow-right" />
          </span>
        </div>
      </div>
    </article>
  );
};
