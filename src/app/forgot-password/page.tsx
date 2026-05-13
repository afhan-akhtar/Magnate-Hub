import ForgotPassword from "@/components/pages/forgot/forgot-password";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Forgot Password MagnetHub",
};
const page = () => {
  return (
    <Wrapper>
      <ForgotPassword />
    </Wrapper>
  );
};

export default page;
