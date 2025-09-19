import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // ✅ backend url from .env
const token = localStorage.getItem("token");

// ========================
// Async Thunks
// ========================

// 🟢 Get cart items
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await axios.get(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

// 🟢 Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (productId) => {
    const res = await axios.post(
      `${API_URL}/cart`,
      { productId, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

// 🟢 Update quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ id, quantity }) => {
    const res = await axios.put(
      `${API_URL}/cart/${id}`,
      { quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

// 🟢 Remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id) => {
    await axios.delete(`${API_URL}/cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  }
);

// ========================
// Slice
// ========================

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalAmount: 0,
    totalQuantity: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;

        // ✅ calculate totals
        state.totalQuantity = action.payload.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        state.totalAmount = action.payload.reduce(
          (acc, item) => acc + item.quantity * item.Product.price,
          0
        );
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add to cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems.push(action.payload);
        state.totalQuantity += action.payload.quantity;
        state.totalAmount +=
          action.payload.Product.price * action.payload.quantity;
      })

      // Update item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.cartItems.findIndex((i) => i.id === updated.id);
        if (index !== -1) {
          state.cartItems[index].quantity = updated.quantity;
        }

        state.totalQuantity = state.cartItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        state.totalAmount = state.cartItems.reduce(
          (acc, item) => acc + item.quantity * item.Product.price,
          0
        );
      })

      // Remove item
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (i) => i.id !== action.payload
        );
        state.totalQuantity = state.cartItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        state.totalAmount = state.cartItems.reduce(
          (acc, item) => acc + item.quantity * item.Product.price,
          0
        );
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
