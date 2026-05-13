/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  getWhistlistFromLocalStorage,
  removeFromWishlist,
} from "@/redux/features/wishlistSlice";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useCategoryNavigation } from "@/hooks/UseCategoryNavigation";
import { apiRequest } from "@/api/axiosInstance";

const DASHBOARD_ORIGIN = "https://dash.magnatehub.au";
const FALLBACK_IMAGE = "/assets/img/notfound/image_notfound.png";

const isValidImageValue = (image: string) => {
  return Boolean(
    image &&
    image.length > 1 &&
    image !== "undefined" &&
    image !== "null" &&
    image !== "[object Object]",
  );
};

const getImageValue = (value: any) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object" && typeof value.src === "string") {
    return value.src.trim();
  }

  return "";
};

const normalizeWishlistImageSrc = (image: string): string => {
  const raw = image.trim();

  if (!raw) {
    return FALLBACK_IMAGE;
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  if (raw.startsWith("/_next/") || raw.startsWith("/assets/")) {
    return raw;
  }

  if (raw.startsWith("assets/")) {
    return `/${raw}`;
  }

  const trimmed = raw.replace(/^\/+/, "");

  if (trimmed.startsWith("uploads/") || trimmed.startsWith("storage/")) {
    return `${DASHBOARD_ORIGIN}/${trimmed}`;
  }

  if (raw.startsWith("/")) {
    return raw;
  }

  return `${DASHBOARD_ORIGIN}/uploads/project/card/${trimmed}`;
};

const getWishlistImageSrc = (item: any, overrideImage?: string): string => {
  const image = [
    overrideImage,
    item?.title_image,
    item?.thumb,
    item?.card,
    item?.image,
  ]
    .map(getImageValue)
    .find(isValidImageValue);

  return image ? normalizeWishlistImageSrc(image) : FALLBACK_IMAGE;
};

const getProjectFromResponse = (response: any) => {
  return (
    response?.data?.data?.[0] ||
    response?.data?.[0] ||
    response?.data ||
    response?.[0] ||
    null
  );
};

const WishlistArea = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);
  const { redirectUser } = useCategoryNavigation();
  const [wishlistHydrated, setWishlistHydrated] = useState(false);
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    dispatch(getWhistlistFromLocalStorage());
    setWishlistHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    if (!wishlistHydrated || wishlist.length === 0) return;

    const itemsMissingImages = wishlist.filter((item: any) => {
      const itemKey = String(item.id ?? item.project_id ?? "");
      return (
        itemKey &&
        !imageOverrides[itemKey] &&
        getWishlistImageSrc(item) === FALLBACK_IMAGE
      );
    });

    if (itemsMissingImages.length === 0) return;

    let isMounted = true;

    const loadMissingImages = async () => {
      const entries = await Promise.all(
        itemsMissingImages.map(async (item: any) => {
          try {
            const projectId = item.project_id || item.id;
            const response = await apiRequest({
              url: `projects?id=${projectId}`,
              method: "GET",
            });
            const project = getProjectFromResponse(response);
            const image = getImageValue(
              project?.title_image || project?.card || project?.image,
            );

            if (!isValidImageValue(image)) {
              return null;
            }

            return [String(item.id ?? projectId), image] as const;
          } catch (error) {
            console.error("Error fetching wishlist image", error);
            return null;
          }
        }),
      );

      if (!isMounted) return;

      const nextOverrides = entries.reduce<Record<string, string>>(
        (acc, entry) => {
          if (entry) {
            acc[entry[0]] = entry[1];
          }
          return acc;
        },
        {},
      );

      if (Object.keys(nextOverrides).length > 0) {
        setImageOverrides((current) => ({ ...current, ...nextOverrides }));
      }
    };

    loadMissingImages();

    return () => {
      isMounted = false;
    };
  }, [imageOverrides, wishlist, wishlistHydrated]);

  const redirectToDetail = (item: any) => {
    redirectUser(item);
  };

  return (
    <>
      <div className="cart-area pb-100 pt-105">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {!wishlistHydrated ? (
                <div className="wishlist-loading" aria-busy="true">
                  <p>Loading wishlist…</p>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="empty">
                  <h4>Your Wishlist is Empty</h4>
                  <p>Save your favorite listings to see them here.</p>
                  <Link href="/listings" className="tg-btn">
                    Browse Listings
                  </Link>
                </div>
              ) : (
                <div className="wishlist-card">
                  <table className="table wishlist-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th className="right">Price</th>
                        <th className="center">Remove</th>
                      </tr>
                    </thead>

                    <tbody>
                      {wishlist.map((item, i) => (
                        <tr
                          key={item.id ?? i}
                          onClick={() => redirectToDetail(item)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            <Image
                              src={getWishlistImageSrc(
                                item,
                                imageOverrides[
                                  String(item.id ?? item.project_id ?? "")
                                ],
                              )}
                              alt={item?.name || "Project image"}
                              width={70}
                              height={70}
                              className="thumb"
                              unoptimized
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/assets/img/notfound/image_notfound.png";
                              }}
                            />
                          </td>

                          <td className="name">{item.name}</td>

                          <td>
                            <span className="badge">
                              {item.location_name ?? "-"}
                            </span>
                          </td>

                          <td className="price">${item.price}.00</td>

                          <td className="center">
                            <button
                              type="button"
                              className="remove"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                dispatch(removeFromWishlist(item));
                              }}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wishlist-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .wishlist-table {
          width: 100%;
          margin-bottom: 0;
        }

        .wishlist-table thead th {
          background: #f8f9fa;
          padding: 16px;
          font-weight: 600;
          border-bottom: none;
        }

        .wishlist-table tbody tr {
          transition: background 0.2s ease;
        }

        .wishlist-table tbody tr:hover {
          background: #fafafa;
        }

        .wishlist-table td {
          padding: 14px 16px;
          vertical-align: middle;
        }

        .thumb {
          border-radius: 8px;
          object-fit: cover;
        }

        .name {
          font-weight: 600;
          color: #222;
          text-decoration: none;
        }

        .badge {
          background: #eef2ff;
          color: #3730a3;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 13px;
        }

        .price {
          text-align: right;
          font-weight: 600;
          color: #2563eb;
        }

        .right {
          text-align: right;
        }

        .center {
          text-align: center;
        }

        .remove {
          border: none;
          background: transparent;
          font-size: 18px;
          cursor: pointer;
          color: #dc2626;
          transition:
            transform 0.2s ease,
            color 0.2s ease;
        }

        .remove:hover {
          transform: scale(1.2);
          color: #991b1b;
        }

        .empty {
          text-align: center;
          padding: 60px 20px;
        }

        .empty h4 {
          font-weight: 600;
          margin-bottom: 10px;
        }

        .empty p {
          color: #6b7280;
          margin-bottom: 20px;
        }

        .wishlist-loading {
          text-align: center;
          padding: 48px 20px;
          color: #6b7280;
        }
      `}</style>
    </>
  );
};

export default WishlistArea;
