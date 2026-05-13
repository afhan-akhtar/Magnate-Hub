import BreadCrumb from "@/components/common/BreadCrumb"
import WishlistArea from "./WishlistArea"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterOne from "@/layouts/footers/FooterOne"

const Wishlist = () => {
  return (
    <>
      <HeaderOne/>
      <main>
        <BreadCrumb title="Wishlist" sub_title="Wishlist" />
        <WishlistArea />
      </main>
      <FooterOne />
    </>
  )
}

export default Wishlist
