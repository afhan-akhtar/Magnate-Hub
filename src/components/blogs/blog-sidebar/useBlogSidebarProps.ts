"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/api/axiosInstance";
import type { BlogCategoryItem } from "./Category";
import type { BlogTagRow } from "./Tags";

function normalizeCategories(list: any[]): BlogCategoryItem[] {
  return list
    .map((c) => ({
      id: Number(c?.id),
      name: String(c?.name).trim(),
      blogs_count:c?.blogs_count 
    }))
    .filter((c) => Number.isFinite(c.id) && c.id > 0 && c.name);
}

function normalizeTags(list: any[]): BlogTagRow[] {
  return list
    .map((t) => ({
      id: Number(t?.id),
      name: String(t?.name).trim(),
      slug: t?.slug ? String(t.slug) : undefined,
    }))
    .filter((t) => Number.isFinite(t.id) && t.id > 0 && t.name);
}

export function useBlogSidebarProps() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isBlogsListing = pathname === "/blogs";

  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [tags, setTags] = useState<BlogTagRow[]>([]);

  const searchQuery = isBlogsListing
    ? searchParams.get("search")?.trim() || ""
    : "";

  const categoryIdParam = searchParams.get("category_id");
  const tagIdParam = searchParams.get("tag_id");

  const activeCategoryId = useMemo(() => {
    if (!isBlogsListing || !categoryIdParam) return null;
    const n = Number(categoryIdParam);
    return Number.isFinite(n) ? n : null;
  }, [isBlogsListing, categoryIdParam]);

  const activeTagId = useMemo(() => {
    if (!isBlogsListing || !tagIdParam) return null;
    const n = Number(tagIdParam);
    return Number.isFinite(n) ? n : null;
  }, [isBlogsListing, tagIdParam]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          apiRequest({ url: "blog-categories", method: "GET" }),
          apiRequest({ url: "blog-tags", method: "GET" }),
        ]);
        if (cancelled) return;
        setCategories(normalizeCategories(catRes.data));
        setTags(normalizeTags(tagRes.data));
      } catch {
        if (!cancelled) {
          setCategories([]);
          setTags([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pushBlogsQuery = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const base = isBlogsListing ? searchParams.toString() : "";
      const p = new URLSearchParams(base);
      mutate(p);
      router.push(`/blogs?${p.toString()}`);
    },
    [isBlogsListing, router, searchParams],
  );

  const onSearchSubmit = useCallback(
    (q: string) => {
      pushBlogsQuery((p) => {
        const trimmed = q.trim();
        if (trimmed) p.set("search", trimmed);
        else p.delete("search");
        p.set("page", "1");
      });
    },
    [pushBlogsQuery],
  );

  const onSelectCategory = useCallback(
    (id: number | null) => {
      pushBlogsQuery((p) => {
        if (id === null) p.delete("category_id");
        else p.set("category_id", String(id));
        p.set("page", "1");
      });
    },
    [pushBlogsQuery],
  );

  const onSelectTag = useCallback(
    (id: number | null) => {
      pushBlogsQuery((p) => {
        if (id === null) p.delete("tag_id");
        else p.set("tag_id", String(id));
        p.set("page", "1");
      });
    },
    [pushBlogsQuery],
  );

  return {
    searchQuery,
    onSearchSubmit,
    categories,
    tags,
    activeCategoryId,
    activeTagId,
    onSelectCategory,
    onSelectTag,
  };
}
