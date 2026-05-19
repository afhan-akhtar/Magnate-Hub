"use client";
import { Suspense } from "react";
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
  return (
    <>
      <HeaderOne />
      <main>
        <Suspense fallback={<Loading loadingText="Loading..." />}>
          <Banner />
        </Suspense>
        <Listing />
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
