import FeatureOne from "@/components/features/feature-one";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title:
    "Feature One Magnet Hub - Tour & Travel Booking React Next js Template",
};
const page = () => {
  return (
    <Wrapper>
      <FeatureOne />
    </Wrapper>
  );
};

export default page;
