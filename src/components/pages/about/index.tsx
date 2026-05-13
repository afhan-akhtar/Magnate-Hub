import BreadCrumb from "@/components/common/BreadCrumb";
import AboutArea from "./AboutArea";
import HeaderOne from "@/layouts/headers/HeaderOne";
import Features from "./Features";
import FooterOne from "@/layouts/footers/FooterOne";
import About3 from "./About";
import Choose from "./Choose";
import ChooseArea from "@/components/homes/home-one/ChooseArea";
import Work from "./Work";

const About = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <BreadCrumb title="About Us" sub_title="About Us" />
        <AboutArea />
        <Choose />
        <About3 />
        <Work />
        <ChooseArea />
        <Features />
      </main>
      <FooterOne />
    </>
  );
};

export default About;
