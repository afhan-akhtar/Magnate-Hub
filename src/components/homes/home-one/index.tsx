"use client";
import { useEffect, useState, Suspense } from "react";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";
import Features from "@/components/pages/about/Features";
import Banner from "./Banner";
import Listing from "./Listing";
import Process from "./Process";
import Testimonial from "./Testimonial";
import Blog from "./Blog";
import Choose from "./Choose";
import ChooseArea from "./ChooseArea";
import OurLocation from "./ourLocations";
import Pricing from "./Pricing";
import Category from "./Category";
import Loading from "@/components/loading/Loading";

const HomeOne = () => {
  const [listing, setListing] = useState<any[]>([]);
  const [localPagination, setLocalPagination] = useState<{
    totalPage: number;
    currentPage: number;
    perPage: number;
    total: number;
    nextPageUrl?: string | null;
    prevPageUrl?: string | null;
  }>({ 
    totalPage: 1, 
    currentPage: 1, 
    perPage: 12, 
    total: 0 
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (localPagination.currentPage && localPagination.currentPage !== currentPage) {
      setCurrentPage(localPagination.currentPage);
    }
  }, [localPagination.currentPage]);

  return (
    <>
      <HeaderOne />
      <main>
        <Suspense fallback={<Loading loadingText="Loading..." />}>
          <Banner 
           setListing={setListing} 
            setLocalPagination={setLocalPagination}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </Suspense>
        <Listing
          listing={listing} 
          pagination={localPagination}
          onPageChange={handlePageChange}
          activePage={currentPage} />
        <Choose />
        <Category/>
        <ChooseArea />
        <Features />
        <OurLocation />
        <Pricing />
        <Process />
        {/* <Testimonial /> */}
        <Blog style={false} />
      </main>
      <FooterOne />
    </>
  );
};

export default HomeOne;
