
import ChangePassword from "@/components/pages/forgot/chnage-password";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Verifiy OTP MagnetHub",
};
const page = () => {
  return (
    <Wrapper>
      <ChangePassword />
    </Wrapper>
  );
};

export default page;
