"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getWhistlistFromLocalStorage } from "@/redux/features/wishlistSlice";

/** Loads wishlist from localStorage after mount so favorites match across pages without SSR/client mismatch. */
export default function WishlistReduxSync() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getWhistlistFromLocalStorage());
  }, [dispatch]);
  return null;
}
