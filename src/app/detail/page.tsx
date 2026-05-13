import { Suspense } from "react"
import Wrapper from "@/layouts/Wrapper";
import ListingDetailsWrapper from "./ListingDetailWrapper";

export const metadata = {
  title: "Listing Details Magnet Hub",
};

export default function Page() {
  return (
    <Wrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <ListingDetailsWrapper />
      </Suspense>
    </Wrapper>
  );
}