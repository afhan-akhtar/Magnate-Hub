
import BreadCrumb from "../common/BreadCrumb"
import ContactArea from "./ContactArea"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterOne from "@/layouts/footers/FooterOne"

const Contact = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb title="Contact Us" sub_title="Contact" />
            <ContactArea />
         </main>
         <FooterOne />
      </>
   )
}

export default Contact
