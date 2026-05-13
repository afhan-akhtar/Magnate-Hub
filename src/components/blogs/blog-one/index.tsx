import { Suspense } from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import BlogArea from "./BlogArea";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";
import Loading from "@/components/loading/Loading";

const BlogOne = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Blogs" sub_title="" />
        <Suspense
          fallback={
            <div className="container py-5 d-flex justify-content-center">
              <Loading />
            </div>
          }
        >
          <BlogArea />
        </Suspense>
      </main>
      <FooterOne />
    </>
  );
};

export default BlogOne
