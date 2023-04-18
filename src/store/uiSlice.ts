import { createSlice, PayloadAction, Middleware } from "@reduxjs/toolkit";
import { rootState } from "./";

export interface UiState {
  sendMsg: string;
}


const initialState: UiState = {
  sendMsg: "",
}

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    changeSendMsg: (state: UiState, action: PayloadAction<string>) => {
      state.sendMsg = action.payload;
    }
  },
});

export const selectSendMsg = (state: rootState) => state.ui.sendMsg;
