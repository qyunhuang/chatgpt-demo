import {configureStore} from "@reduxjs/toolkit";
import {uiSlice, localStorageMiddleware} from "./uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
  middleware: [localStorageMiddleware]
});

export type rootState = ReturnType<typeof store.getState>;
