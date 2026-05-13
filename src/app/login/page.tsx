import Login from "@/components/pages/login";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Login MagnetHub",
};
const page = () => {
  return (
    <Wrapper>
      <Login />
    </Wrapper>
  )
}

export default page