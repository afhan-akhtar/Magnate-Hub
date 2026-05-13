import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/api/axiosInstance";

export const useCategoryNavigation = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  const getCategoryData = async () => {
    try {
      setLoading(true);
      const response = await apiRequest({
        method: "GET",
        url: "categories",
      });
      setCategoryData(response?.data || []);
    } catch (error) {
      console.error("Error fetching category data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  const showImageAccordingToCategory = (category: string) => {
    const getImage = categoryData?.find((x) => x.name === category);

    if (getImage?.image) {
      const fileName = getImage.image.split("/").pop();
      return fileName;
    }
  };

  const redirectUser = (item: any) => {
    if (typeof window !== "undefined" && item?.category_name) {
      window.localStorage.removeItem("categoryName");
      window.localStorage.setItem("categoryName", item.category_name);
    }
    const imageUrl = showImageAccordingToCategory(item?.category_name);
    router.push(`/detail?url=${item.url}&id=${item.id}&category=${imageUrl}`);
  };

  return {
    loading,
    categoryData,
    getCategoryData,
    showImageAccordingToCategory,
    redirectUser,
  };
};
