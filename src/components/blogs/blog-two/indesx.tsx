import BreadCrumb from "@/components/common/BreadCrumb"
import BlogArea from "./BlogArea"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterOne from "@/layouts/footers/FooterOne"

const BlogTwo = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Blog-Detail" sub_title="" />
        <BlogArea />
      </main>
      <FooterOne />
    </>
  )
}

export default BlogTwo
