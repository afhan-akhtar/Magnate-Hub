import PremiumPackages from "@/components/pages/premium-packages";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Premium Packages MagnetHub",
};
const page = () => {
   return (
      <Wrapper>
         <PremiumPackages />
      </Wrapper>
   )
}

export default page