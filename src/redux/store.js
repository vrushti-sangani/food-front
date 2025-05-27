import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./slices/customerSlice";
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";

// Use process.env.NODE_ENV for React projects
const store = configureStore({
  reducer: {
    customer: customerSlice,
    cart : cartSlice,
    user: userSlice
  },
  devTools: process.env.NODE_ENV !== "production" // Use process.env.NODE_ENV
});

export default store;
