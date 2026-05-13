import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { setLocalStorage, getLocalStorage } from "../../utils/localstorage";

export interface Product {
   id: number;
   title: string;
   thumb: string;
   price: number;
   name:string;
   location_name:string;
   title_image:string;
   category_name:string;
   card?: string;
   url?: string;
   project_id?: string | number;
}

interface WishlistState {
   wishlist: Product[];
}

/** Always empty on both server and client first paint — load via getWhistlistFromLocalStorage in useEffect to avoid hydration mismatch. */
const initialState: WishlistState = {
   wishlist: [],
};

const wishlistSlice = createSlice({
   name: "wishlist",
   initialState,
   reducers: {
      addToWishlist: (state, { payload }: PayloadAction<Product>) => {
         const productIndex = state.wishlist.findIndex((item) => item.id === payload.id);
         if (productIndex >= 0) {
            toast.info(`${payload.name} is already in your wishlist`, {
               position: "top-right",
            });
         } else {
            state.wishlist.push(payload);
            toast.success(`${payload.name} added to wishlist`, {
               position: "top-right",
            });
            setLocalStorage("wishlist", state.wishlist);
         }
      },
      removeFromWishlist: (state, { payload }: PayloadAction<Product>) => {
         state.wishlist = state.wishlist.filter((item) => item.id !== payload.id);
         toast.error(`Removed from your wishlist`, {
            position: "top-right",
         });
         setLocalStorage("wishlist", state.wishlist);
      },
      clearWishlist: (state) => {
         state.wishlist = [];
         setLocalStorage("wishlist", state.wishlist);
      },
      getWhistlistFromLocalStorage: (state) => {
         const storedWishlist = getLocalStorage<Product>("wishlist");
         if (storedWishlist) {
            state.wishlist = storedWishlist;
         }  
      },
   },
});

export const {
   addToWishlist,
   removeFromWishlist,
   clearWishlist,
   getWhistlistFromLocalStorage
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
