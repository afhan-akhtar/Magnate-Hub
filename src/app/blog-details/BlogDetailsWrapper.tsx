"use client";
import BlogDetails from "@/components/blogs/blog-details";
import Loading from "@/components/loading/Loading";
import { useSearchParams } from "next/navigation";

const BlogDetailsWrapper = () => {
  const params = useSearchParams();
  const id = params.get("id");
  const url = params.get("url");

  if (!id || !url) return <Loading loadingText={"Loading..."}/>;

  return <BlogDetails id={id} url={url} />;
};

export default BlogDetailsWrapper;
