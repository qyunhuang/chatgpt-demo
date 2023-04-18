import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});

export type rootState = ReturnType<typeof store.getState>;
