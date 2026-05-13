import BreadCrumb from "@/components/common/BreadCrumb"
import BlogDetailsArea from "./BlogDetailsArea"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterOne from "@/layouts/footers/FooterOne"

const Media1 = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="Media" sub_title="Exploring The Green Spac Realar Residence Area Harmony" />
        <BlogDetailsArea />
      </main>
      <FooterOne />
    </>
  )
}

export default Media1
