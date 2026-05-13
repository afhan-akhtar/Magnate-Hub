import BreadCrumb from "@/components/common/BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import BlogArea from "./BlogArea"
import FooterSix from "@/layouts/footers/FooterSix"
import HeaderOne from "@/layouts/headers/HeaderOne"

const BlogTwo = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Blogs" sub_title="Blog" />
        <BlogArea />
      </main>
      <FooterSix />
    </>
  )
}

export default BlogTwo
