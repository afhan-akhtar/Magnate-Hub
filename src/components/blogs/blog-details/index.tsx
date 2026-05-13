import { Suspense } from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import BlogDetailsArea from "./BlogDetailsArea";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";
import Loading from "@/components/loading/Loading";

type BlogDetailsProps = {
  id: string | null;
  url: string | null;
};

const BlogDetails = ({ id, url }: BlogDetailsProps) => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb
          title="Blog Details"
          sub_title="Exploring The Green Spac Realar Residence Area Harmony"
        />
        <Suspense
          fallback={
            <div className="container py-5 d-flex justify-content-center">
              <Loading />
            </div>
          }
        >
          <BlogDetailsArea id={id} url={url} />
        </Suspense>
      </main>
      <FooterOne />
    </>
  );
};

export default BlogDetails;
