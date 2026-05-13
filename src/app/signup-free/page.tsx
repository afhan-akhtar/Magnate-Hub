import Signupfree from "@/components/pages/signup-free";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Signup MagnetHub",
};
const page = () => {
  return (
    <Wrapper>
      <Signupfree />
    </Wrapper>
  );
};

export default page;
