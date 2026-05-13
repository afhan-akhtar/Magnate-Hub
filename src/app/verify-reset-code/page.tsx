
import VerifyOtp from "@/components/pages/forgot/verify-otp";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Verifiy OTP MagnetHub",
};
const page = () => {
  return (
    <Wrapper>
      <VerifyOtp />
    </Wrapper>
  );
};

export default page;
