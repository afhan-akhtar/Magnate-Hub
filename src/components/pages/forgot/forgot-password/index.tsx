import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";
import ForgotPasswordArea from "./ForgotPasswordArea";

const ForgotPassword = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <ForgotPasswordArea />
      </main>
      <FooterOne />
    </>
  );
};

export default ForgotPassword;
