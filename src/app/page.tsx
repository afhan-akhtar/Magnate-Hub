import HomeOne from "@/components/homes/home-one";
import { AuthProvider } from "@/context/AuthContext";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Magnet Hub",
};
const page = () => {
  return (
    <Wrapper>
      <HomeOne />
    </Wrapper>
  );
};

export default page;
