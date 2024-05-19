import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import sidebarSliceReducer from "../features/sidebar/sidebarSlice";
import userAuthSliceReducer from "../features/auth/userAuthSlice";

export const store = configureStore({
  reducer: {
    sidebarMenu: sidebarSliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    userAuth: userAuthSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
