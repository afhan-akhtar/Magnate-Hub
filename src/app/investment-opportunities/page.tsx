import InvestmentOpportunities from "@/components/pages/investment-opportunities";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Investment Opportunities MagnetHub",
};
const page = () => {
   return (
      <Wrapper>
         <InvestmentOpportunities />
      </Wrapper>
   )
}

export default page