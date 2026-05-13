import { Suspense } from "react"
import Wrapper from "@/layouts/Wrapper";
import BlogDetailsWrapper from "./BlogDetailsWrapper";

export const metadata = {
  title: "Blog Details Magnet Hub",
};

export default function Page() {
  return (
    <Wrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogDetailsWrapper />
      </Suspense>
    </Wrapper>
  );
}