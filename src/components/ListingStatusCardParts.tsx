"use client";

import { type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Location from "@/svg/home-one/Location";
import Wishlist from "@/svg/home-one/Wishlist";
import {
  getListingStatusLabel,
  getListingStatusMode,
  isListingSold,
  isListingUnderOffer,
} from "@/lib/listingStatus";

export type StatusListingItem = {
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
};

export { getListingStatusMode, isListingSold, isListingUnderOffer };

const formatListingPrice = (price?: string | number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
};

const ListingStatusStyles = () => (
  <style jsx global>{`
    .magnet-status-card {
      --ease: cubic-bezier(0.22, 1, 0.36, 1);
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      border-radius: 26px;
      overflow: hidden;
      cursor: pointer;
      transition:
        transform 0.32s var(--ease),
        box-shadow 0.32s var(--ease);
    }

    .magnet-status-card:hover {
      transform: translateY(-4px);
    }

    .magnet-status-card--under-offer {
      background: linear-gradient(165deg, #ffffff 0%, #fff7f7 100%);
      border: 1px solid rgba(239, 68, 68, 0.22);
      box-shadow: 0 18px 44px -16px rgba(220, 38, 38, 0.18);
    }

    .magnet-status-card--under-offer:hover {
      box-shadow: 0 24px 52px -14px rgba(220, 38, 38, 0.24);
    }

    .magnet-status-card--sold {
      background: linear-gradient(165deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1px solid rgba(100, 116, 139, 0.2);
      box-shadow: 0 18px 44px -16px rgba(15, 23, 42, 0.12);
    }

    .magnet-status-card__banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 48px;
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .magnet-status-card--under-offer .magnet-status-card__banner {
      background: linear-gradient(90deg, #fecaca 0%, #fca5a5 50%, #f87171 100%);
      color: #7f1d1d;
    }

    .magnet-status-card--sold .magnet-status-card__banner {
      background: linear-gradient(90deg, #64748b 0%, #475569 100%);
      color: #f8fafc;
    }

    .magnet-status-card__banner-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .magnet-status-card--under-offer .magnet-status-card__banner-dot {
      background: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
    }

    .magnet-status-card--sold .magnet-status-card__banner-dot {
      background: #94a3b8;
    }

    .magnet-status-card__media {
      position: relative;
      margin: 0 14px;
      height: 210px;
      border-radius: 18px;
      overflow: hidden;
      background: #e2e8f0;
    }

    .magnet-status-card__media-image {
      width: 100%;
      height: 210px;
      object-fit: cover;
      transition:
        transform 0.5s var(--ease),
        filter 0.5s var(--ease);
    }

    .magnet-status-card--under-offer:hover .magnet-status-card__media-image {
      transform: scale(1.04);
    }

    .magnet-status-card--sold .magnet-status-card__media-image {
      filter: grayscale(0.85) brightness(0.92);
    }

    .magnet-status-card__media-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .magnet-status-card--under-offer .magnet-status-card__media-overlay {
      background: linear-gradient(
        180deg,
        rgba(127, 29, 29, 0.08) 0%,
        transparent 45%,
        rgba(127, 29, 29, 0.12) 100%
      );
    }

    .magnet-status-card--sold .magnet-status-card__media-overlay {
      background: rgba(15, 23, 42, 0.35);
    }

    .magnet-status-card__sold-stamp {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .magnet-status-card__sold-stamp span {
      padding: 10px 22px;
      border: 3px solid rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      background: rgba(15, 23, 42, 0.72);
      color: #ffffff;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 0.2em;
      transform: rotate(-8deg);
    }

    .magnet-status-card__wishlist-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 5;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
      cursor: pointer;
    }

    .magnet-status-card__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 16px 18px 20px;
    }

    .magnet-status-card__listing-id {
      margin: 0 0 8px;
      color: #94a3b8;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .magnet-status-card__title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin: 0;
      color: #0f172a;
      font-size: 19px;
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 1.2;
      text-decoration: none;
    }

    .magnet-status-card--under-offer .magnet-status-card__title:hover {
      color: #b91c1c;
    }

    .magnet-status-card__category {
      margin: 10px 0;
      color: #64748b;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .magnet-status-card__location-row {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #64748b;
      font-size: 12px;
      font-weight: 500;
    }

    .magnet-status-card__location-row svg {
      color: #94a3b8;
    }

    .magnet-status-card__location-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .magnet-status-card__footer {
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid rgba(148, 163, 184, 0.2);
    }

    .magnet-status-card__footer-note {
      font-size: 12px;
      font-weight: 600;
      line-height: 1.4;
    }

    .magnet-status-card--under-offer .magnet-status-card__footer-note {
      color: #b91c1c;
    }

    .magnet-status-card--sold .magnet-status-card__footer-note {
      color: #475569;
    }

    .magnet-status-card__price-muted {
      color: #94a3b8;
      font-size: 13px;
      font-weight: 600;
      text-decoration: line-through;
    }
  `}</style>
);

type StatusListingCardProps = {
  item: StatusListingItem;
  detailHref: string;
  isInWishlist: boolean;
  onWishlistClick: (event: MouseEvent) => void;
  onCardClick: () => void;
  listingReferenceField?: "id" | "project_id";
  cardClassName?: string;
  wishlistClassName?: string;
  titleClassName?: string;
};

export const UnderOfferListingCard = ({
  item,
  detailHref,
  isInWishlist,
  onWishlistClick,
  onCardClick,
  listingReferenceField = "project_id",
  cardClassName = "",
  wishlistClassName = "",
  titleClassName = "",
}: StatusListingCardProps) => {
  const referenceId =
    listingReferenceField === "id" ? item.id : item.project_id;
  const listingCode = `MGH-${new Date().getFullYear()}-${referenceId}`;
  const statusLabel = getListingStatusLabel(item);

  return (
    <article
      className={`tg-listing-card-item tg-listing-su-card-item mb-25 magnet-status-card magnet-status-card--under-offer ${cardClassName}`.trim()}
      onClick={onCardClick}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onCardClick();
        }
      }}
      aria-label={`${statusLabel} listing: ${item.name}`}
    >
      <ListingStatusStyles />

      <div className="magnet-status-card__banner">
        <span className="magnet-status-card__banner-dot" aria-hidden />
        {statusLabel}
      </div>

      <div className="magnet-status-card__media">
        <Image
          className={`tg-card-border w-100 magnet-status-card__media-image ${wishlistClassName}`}
          src={`https://dash.magnatehub.au${item.title_image}`}
          alt={item.name}
          width={280}
          height={210}
          unoptimized
          onError={(e) => {
            e.currentTarget.src = "assets/img/notfound/image_notfound.png";
          }}
        />
        <div className="magnet-status-card__media-overlay" aria-hidden />
        <button
          type="button"
          className={`magnet-status-card__wishlist-btn ${wishlistClassName}`.trim()}
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
            style={{ color: isInWishlist ? "#e11d48" : "#64748b" }}
          />
        </button>
      </div>

      <div className="magnet-status-card__body">
        <p className="magnet-status-card__listing-id">{listingCode}</p>
        <h4 className="tg-listing-card-title" style={{ margin: 0 }}>
          <Link href={detailHref} onClick={(event) => event.stopPropagation()}>
            <span
              className={`magnet-status-card__title ${titleClassName}`.trim()}
              title={item.name}
            >
              {item.name}
            </span>
          </Link>
        </h4>
        {item.category_name ? (
          <p className="magnet-status-card__category">{item.category_name}</p>
        ) : null}
        {item.location_name ? (
          <div className="magnet-status-card__location-row">
            <Location />
            <span className="magnet-status-card__location-text">
              {item.location_name}
            </span>
          </div>
        ) : null}
        <div className="magnet-status-card__footer">
          <p className="magnet-status-card__footer-note">
            This listing is currently under offer. Enquire for similar
            opportunities.
          </p>
          {item.price ? (
            <p className="magnet-status-card__price-muted" style={{ marginTop: 8 }}>
              Was ${formatListingPrice(item.price)}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export const SoldListingCard = ({
  item,
  detailHref,
  isInWishlist,
  onWishlistClick,
  onCardClick,
  listingReferenceField = "project_id",
  cardClassName = "",
  wishlistClassName = "",
  titleClassName = "",
}: StatusListingCardProps) => {
  const referenceId =
    listingReferenceField === "id" ? item.id : item.project_id;
  const listingCode = `MGH-${new Date().getFullYear()}-${referenceId}`;

  return (
    <article
      className={`tg-listing-card-item tg-listing-su-card-item mb-25 magnet-status-card magnet-status-card--sold ${cardClassName}`.trim()}
      onClick={onCardClick}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onCardClick();
        }
      }}
      aria-label={`Sold listing: ${item.name}`}
    >
      <ListingStatusStyles />

      <div className="magnet-status-card__banner">
        <span className="magnet-status-card__banner-dot" aria-hidden />
        Sold
      </div>

      <div className="magnet-status-card__media">
        <Image
          className={`tg-card-border w-100 magnet-status-card__media-image`}
          src={`https://dash.magnatehub.au${item.title_image}`}
          alt={item.name}
          width={280}
          height={210}
          unoptimized
          onError={(e) => {
            e.currentTarget.src = "assets/img/notfound/image_notfound.png";
          }}
        />
        <div className="magnet-status-card__media-overlay" aria-hidden />
        <div className="magnet-status-card__sold-stamp" aria-hidden>
          <span>SOLD</span>
        </div>
        <button
          type="button"
          className={`magnet-status-card__wishlist-btn ${wishlistClassName}`.trim()}
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
            style={{ color: isInWishlist ? "#e11d48" : "#64748b" }}
          />
        </button>
      </div>

      <div className="magnet-status-card__body">
        <p className="magnet-status-card__listing-id">{listingCode}</p>
        <h4 className="tg-listing-card-title" style={{ margin: 0 }}>
          <Link href={detailHref} onClick={(event) => event.stopPropagation()}>
            <span
              className={`magnet-status-card__title ${titleClassName}`.trim()}
              title={item.name}
            >
              {item.name}
            </span>
          </Link>
        </h4>
        {item.category_name ? (
          <p className="magnet-status-card__category">{item.category_name}</p>
        ) : null}
        {item.location_name ? (
          <div className="magnet-status-card__location-row">
            <Location />
            <span className="magnet-status-card__location-text">
              {item.location_name}
            </span>
          </div>
        ) : null}
        <div className="magnet-status-card__footer">
          <p className="magnet-status-card__footer-note">
            This business has been sold and is no longer available.
          </p>
        </div>
      </div>
    </article>
  );
};
