"use client";
import DetailClient from "@/components/listing-detail/DetailClient";
import Loading from "@/components/loading/Loading";
import { useSearchParams } from "next/navigation";

const ListingDetailsWrapper = () => {
  const params = useSearchParams();
  const id = params.get("id");
  const url = params.get("url");
  const category = decodeURIComponent(params.get("category") || "");
  
  if (!id || !url || !category) return <Loading loadingText={"Loading..."}/>;

  return <DetailClient id={id} url={url} category={category} />;
};

export default ListingDetailsWrapper;
