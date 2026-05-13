import Register from "@/components/pages/register";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Register MagnetHub",
};
const page = () => {
  return (
    <Wrapper>
      <Register />
    </Wrapper>
  )
}

export default page