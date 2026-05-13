"use client";
import BreadCrumb from "@/components/common/BreadCrumb";
import { apiRequest } from "@/api/axiosInstance";
import FooterOne from "@/layouts/footers/FooterOne";
import HeaderOne from "@/layouts/headers/HeaderOne";
import React, { useEffect, useState } from "react";
import ListingDetail from "./ListingDetail";

interface DetailClientProps {
  url: string;
  id: string;
  category?: string;
}

const DetailClient: React.FC<DetailClientProps> = ({ url, id, category }) => {
  const [heroTitle, setHeroTitle] = useState("Listing Details");
  const [heroSubTitle, setHeroSubTitle] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchHeroContent = async () => {
      try {
        const storedCategoryName =
          typeof window !== "undefined"
            ? window.localStorage.getItem("categoryName")
            : "";

        if (storedCategoryName && isMounted) {
          setHeroTitle(storedCategoryName);
        }

        const response = await apiRequest({
          url: `projects?id=${id}`,
          method: "GET",
        });
        const listing = response?.data?.data?.[0];

        if (!isMounted || !listing) {
          return;
        }

        if (listing?.category_name) {
          setHeroTitle(listing.category_name);

          if (typeof window !== "undefined") {
            window.localStorage.setItem("categoryName", listing.category_name);
          }
        }

        setHeroSubTitle(listing?.name || "");
      } catch (error) {
        console.error("Error fetching listing hero content", error);
      }
    };

    if (id) {
      fetchHeroContent();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb
          title={heroTitle}
          sub_title={heroSubTitle}
          category={category}
          isCallFrom={"listingDetail"}
        />
        <div className="tg-chose-area p-relative z-index-9 pt-135 pb-140">
          <ListingDetail url={url} id={id}></ListingDetail>
        </div>
      </main>
      <FooterOne />
    </>
  );
};

export default DetailClient;
