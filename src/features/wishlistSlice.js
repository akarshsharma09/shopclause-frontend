import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [], // product objects
  },
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);
      if (!exists) {
        state.items.push(product); // add only if not already present
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
