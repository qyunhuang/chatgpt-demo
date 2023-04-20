import { createSlice, PayloadAction, Middleware } from "@reduxjs/toolkit";
import { rootState } from "./";

export interface IMsg {
  id: number;
  msg: string;
  msgType: 'question' | 'answer';
}

export interface UiState {
  curQustion: string;
  onProgress: boolean;
  history: IMsg[];
}

const initialState: UiState = {
  curQustion: "",
  onProgress: false,
  history: localStorage.getItem("chatHistory") ? JSON.parse(localStorage.getItem("chatHistory") as string) : [],
}

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    changeQustion: (state: UiState, action: PayloadAction<string>) => {
      state.curQustion = action.payload;
      state.history.push({
        id: state.history.length,
        msg: action.payload,
        msgType: 'question',
      });
    },
    changeCurAnswer: (state: UiState, action: PayloadAction<string>) => {
      if (state.history[state.history.length - 1].msgType === 'question') {
        state.history.push({
          id: state.history.length,
          msg: action.payload,
          msgType: 'answer',
        });
        return;
      }

      state.history[state.history.length - 1].msg = action.payload;
    },
    changeOnProgress: (state: UiState, action: PayloadAction<boolean>) => {
      state.onProgress = action.payload;
    }
  },
});

export const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);

  localStorage.setItem("chatHistory", JSON.stringify(store.getState().ui.history));
  return result;
}

export const selectSendMsg = (state: rootState) => state.ui.curQustion;
export const selectHistory = (state: rootState) => state.ui.history;
export const selectOnProgress = (state: rootState) => state.ui.onProgress;
