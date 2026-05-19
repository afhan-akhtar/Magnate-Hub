"use client";

import { type MouseEvent, type SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import Location from "@/svg/home-one/Location";
import Wishlist from "@/svg/home-one/Wishlist";
import { getListingStatusMode } from "@/lib/listingStatus";
import {
  SoldListingCard,
  UnderOfferListingCard,
} from "@/components/ListingStatusCardParts";

export type PremiumListingItem = {
  id: number;
  project_id: number | string;
  url: string;
  category_name: string;
  name: string;
  title_image: string;
  price?: string | number;
  location_name?: string;
  tag?: string;
  sold?: string | number;
  premium?: string | number;
};

export const isPremiumListing = (item: { premium?: string | number }) =>
  String(item?.premium) === "1";

export const premiumStyles = {
  card: "magnet-premium-card",
  media: "magnet-premium-card__media",
  mediaImage: "magnet-premium-card__media-image",
  body: "magnet-premium-card__body",
  title: "magnet-premium-card__title",
  footer: "magnet-premium-card__footer",
  priceTag: "magnet-premium-card__price",
  priceTagBg: "magnet-premium-card__price-bg",
  priceTagText: "magnet-premium-card__price-text",
};

const formatListingPrice = (price?: string | number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
};

const PremiumCrownIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    {...props}
  >
    <path d="M5 16.5 3.2 7.5l4.2 3.1L12 5l4.6 5.6 4.2-3.1L19 16.5H5zm0 2h14v1.5H5V18.5z" />
  </svg>
);

const ArrowRightIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const PremiumListingStyles = () => (
  <style jsx global>{`
    .magnet-premium-card {
      --purple: #7c3aed;
      --purple-mid: #6d28d9;
      --purple-deep: #4c1d95;
      --purple-soft: #ebe5fa;
      --purple-tint: #f5efff;
      --ink: #1e1b4b;
      --ink-muted: #5b5675;
      --ease: cubic-bezier(0.22, 1, 0.36, 1);
      isolation: isolate;
      position: relative;
      background: #ffffff !important;
      border: 2px solid rgba(124, 58, 237, 0.35) !important;
      border-radius: 26px !important;
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 1) inset,
        0 18px 44px -16px rgba(76, 29, 149, 0.18),
        0 4px 14px -6px rgba(124, 58, 237, 0.12) !important;
      overflow: visible !important;
      padding: 0 !important;
      transition:
        transform 0.35s var(--ease),
        box-shadow 0.35s var(--ease),
        border-color 0.35s var(--ease) !important;
    }

    .magnet-premium-card:hover {
      transform: translateY(-5px);
      border-color: rgba(124, 58, 237, 0.55) !important;
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 1) inset,
        0 24px 52px -14px rgba(76, 29, 149, 0.22),
        0 8px 22px -8px rgba(124, 58, 237, 0.18) !important;
    }

    .magnet-premium-card:focus-visible {
      outline: 2px solid var(--purple);
      outline-offset: 3px;
    }

    .magnet-premium-card__hero {
      position: relative;
      padding: 0 14px;
      margin-top: 14px;
    }

    .magnet-premium-card__badge-float {
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 8;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .magnet-premium-card__crown-ring {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(
        145deg,
        #a78bfa 0%,
        #7c3aed 45%,
        #6d28d9 75%,
        #4c1d95 100%
      );
      border: 3px solid #ffffff;
      color: #ffffff;
      box-shadow:
        0 12px 28px rgba(76, 29, 149, 0.35),
        0 0 0 1px rgba(124, 58, 237, 0.2),
        inset 0 2px 4px rgba(255, 255, 255, 0.4);
      transition: transform 0.35s var(--ease);
    }

    .magnet-premium-card__crown-ring svg {
      width: 30px;
      height: 30px;
      filter: drop-shadow(0 1px 2px rgba(49, 46, 129, 0.35));
    }

    .magnet-premium-card:hover .magnet-premium-card__crown-ring {
      transform: scale(1.05) translateY(-2px);
    }

    .magnet-premium-card__badge-label {
      padding: 4px 12px;
      border-radius: 999px;
      background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #f5f3ff;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.16em;
      line-height: 1;
      text-transform: uppercase;
      white-space: nowrap;
      box-shadow: 0 6px 16px rgba(76, 29, 149, 0.28);
    }

    .magnet-premium-card__media {
      position: relative;
      width: 100% !important;
      height: 218px !important;
      margin: 28px 0 0 !important;
      overflow: hidden !important;
      border-radius: 18px !important;
      background: #e7e5e4 !important;
      box-shadow:
        inset 0 0 0 1px rgba(28, 25, 23, 0.06),
        0 10px 28px rgba(28, 25, 23, 0.08) !important;
    }

    .magnet-premium-card__media-image {
      width: 100% !important;
      height: 218px !important;
      object-fit: cover !important;
      transition: transform 0.55s var(--ease) !important;
    }

    .magnet-premium-card:hover .magnet-premium-card__media-image {
      transform: scale(1.05) !important;
    }

    .magnet-premium-card__media-overlay {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background: linear-gradient(
        180deg,
        rgba(28, 25, 23, 0.12) 0%,
        transparent 38%,
        transparent 62%,
        rgba(28, 25, 23, 0.2) 100%
      );
    }

    .magnet-premium-card__wishlist-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 7;
      cursor: pointer;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 6px 18px rgba(28, 25, 23, 0.12);
      transition: transform 0.28s var(--ease);
    }

    .magnet-premium-card__wishlist-btn:hover {
      transform: scale(1.07);
    }

    .magnet-premium-card__wishlist-btn--active {
      background: #fff1f2;
    }

    .magnet-premium-card__status-tag {
      position: absolute;
      left: 12px;
      bottom: 12px;
      z-index: 6;
      max-width: 58%;
      padding: 7px 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid rgba(239, 68, 68, 0.18);
      color: #dc2626;
      font-size: 10px;
      font-weight: 700;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 4px 12px rgba(28, 25, 23, 0.1);
    }

    .magnet-premium-card__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 16px 18px 20px !important;
    }

    .magnet-premium-card__listing-id {
      margin: 0 0 10px;
      color: #8b83a8;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
    }

    .magnet-premium-card .tg-listing-card-title {
      margin: 0 0 12px !important;
      min-height: 42px;
    }

    .magnet-premium-card__title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: var(--ink) !important;
      font-size: 20px !important;
      font-weight: 800 !important;
      letter-spacing: -0.04em !important;
      line-height: 1.2 !important;
      transition: color 0.25s ease;
    }

    .magnet-premium-card__category {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      max-width: 100%;
      margin-bottom: 10px;
      padding: 7px 12px;
      border-radius: 10px;
      background: var(--purple-tint);
      border: 1px solid rgba(124, 58, 237, 0.16);
      color: var(--purple-deep);
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      line-height: 1.25;
      text-transform: uppercase;
    }

    .magnet-premium-card__category-dot {
      width: 6px;
      height: 6px;
      flex-shrink: 0;
      border-radius: 50%;
      background: linear-gradient(180deg, #34d399 0%, #059669 100%);
      box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.15);
    }

    .magnet-premium-card__category span:last-child {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .magnet-premium-card__location-row {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
      margin-bottom: 2px;
      color: var(--ink-muted);
      font-size: 13px;
      font-weight: 500;
    }

    .magnet-premium-card__location-row svg {
      color: #a8a29e;
      flex-shrink: 0;
    }

    .magnet-premium-card__location-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .magnet-premium-card__footer {
      padding-top: 14px !important;
      margin-top: 10px !important;
      border-top: 1px solid rgba(124, 58, 237, 0.1) !important;
    }

    .magnet-premium-card__footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .magnet-premium-card__price {
      position: relative;
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      padding: 10px 18px;
      color: #1c1917;
      border-radius: 14px;
      overflow: hidden;
      transition: transform 0.3s var(--ease);
    }

    .magnet-premium-card:hover .magnet-premium-card__price {
      transform: translateY(-1px);
    }

    .magnet-premium-card__price-bg {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(
        135deg,
        #a78bfa 0%,
        #7c3aed 50%,
        #6d28d9 100%
      );
      border: 1px solid rgba(124, 58, 237, 0.25);
    }

    .magnet-premium-card__price-text {
      position: relative;
      z-index: 1;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: -0.04em;
      line-height: 1;
      color: #ffffff;
    }

    .magnet-premium-card__view-details {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%);
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      transition:
        background 0.25s ease,
        transform 0.25s var(--ease);
    }

    .magnet-premium-card:hover .magnet-premium-card__view-details {
      background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    }

    .magnet-premium-card__view-details svg {
      width: 16px;
      height: 16px;
      color: #e9d5ff;
      transition: transform 0.28s var(--ease);
    }

    .magnet-premium-card:hover .magnet-premium-card__view-details svg {
      transform: translateX(3px);
    }

    @media (hover: hover) and (pointer: fine) {
      .magnet-premium-card:hover .magnet-premium-card__title,
      .home-premium-listing-card:hover .home-premium-listing-title,
      .listing-page-premium-card:hover .listing-page-premium-title {
        color: var(--purple) !important;
      }
    }

    @media (max-width: 575px) {
      .magnet-premium-card__crown-ring {
        width: 54px;
        height: 54px;
      }

      .magnet-premium-card__crown-ring svg {
        width: 26px;
        height: 26px;
      }

      .magnet-premium-card__title {
        font-size: 18px !important;
      }

      .magnet-premium-card__media,
      .magnet-premium-card__media-image {
        height: 196px !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .magnet-premium-card,
      .magnet-premium-card__media-image,
      .magnet-premium-card__crown-ring,
      .magnet-premium-card__price {
        transition: none !important;
      }

      .magnet-premium-card:hover {
        transform: none;
      }
    }
  `}</style>
);

type PremiumListingCardProps = {
  item: PremiumListingItem;
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

export const PremiumListingCard = ({
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
}: PremiumListingCardProps) => {
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

  const referenceId =
    listingReferenceField === "id" ? item.id : item.project_id;
  const listingCode = `MGH-${new Date().getFullYear()}-${referenceId}`;

  return (
    <article
      className={`tg-listing-card-item tg-listing-su-card-item mb-25 ${premiumStyles.card} ${cardClassName}`.trim()}
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
      aria-label={`Premium listing: ${item.name}`}
    >
      <PremiumListingStyles />

      <div className="magnet-premium-card__hero">
        <div className="magnet-premium-card__badge-float">
          <span className="magnet-premium-card__crown-ring">
            <PremiumCrownIcon />
          </span>
          <span className="magnet-premium-card__badge-label">Premium</span>
        </div>

        <div
          className={`${premiumStyles.media} ${mediaClassName}`.trim()}
          style={{ position: "relative" }}
        >
          <Image
            className={`tg-card-border w-100 ${premiumStyles.mediaImage}`}
            src={`https://dash.magnatehub.au${item.title_image}`}
            alt={item?.name || "Listing image"}
            width={280}
            height={218}
            unoptimized
            onError={(e) => {
              e.currentTarget.src = "assets/img/notfound/image_notfound.png";
            }}
          />
          <div className="magnet-premium-card__media-overlay" aria-hidden />

          <button
            type="button"
            className={`magnet-premium-card__wishlist-btn ${wishlistClassName} ${isInWishlist ? "magnet-premium-card__wishlist-btn--active" : ""}`.trim()}
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
                color: isInWishlist ? "#e11d48" : "#57534e",
                display: "block",
              }}
            />
          </button>
        </div>
      </div>

      <div className={`tg-listing-card-content ${premiumStyles.body}`}>
        <p className="magnet-premium-card__listing-id">{listingCode}</p>

        <h4 className="tg-listing-card-title">
          <Link href={detailHref} onClick={(event) => event.stopPropagation()}>
            <span
              className={`${premiumStyles.title} ${titleClassName}`.trim()}
              title={item.name}
            >
              {item.name}
            </span>
          </Link>
        </h4>

        {item.category_name ? (
          <div className="magnet-premium-card__category" title={item.category_name}>
            <span className="magnet-premium-card__category-dot" aria-hidden />
            <span>{item.category_name}</span>
          </div>
        ) : null}

        {item.location_name ? (
          <div className="magnet-premium-card__location-row">
            <Location />
            <span
              className="magnet-premium-card__location-text"
              title={item.location_name}
            >
              {item.location_name}
            </span>
          </div>
        ) : null}

        <div className={premiumStyles.footer}>
          <div className="magnet-premium-card__footer-inner">
            <span className={premiumStyles.priceTag}>
              <span className={premiumStyles.priceTagBg} aria-hidden />
              <span className={premiumStyles.priceTagText}>
                ${formatListingPrice(item.price)}
              </span>
            </span>

            <span className="magnet-premium-card__view-details">
              View Details
              <ArrowRightIcon />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
