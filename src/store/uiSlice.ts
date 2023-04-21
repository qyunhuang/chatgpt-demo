import { createSlice, PayloadAction, Middleware } from "@reduxjs/toolkit";
import { rootState } from "./";

export interface IMsg {
  id: number;
  msg: string;
  msgType: 'question' | 'answer';
}

export interface ISession {
  id: string;
  curQuestion: string;
  onProgress: boolean;
  history: IMsg[];
}

export interface UiState {
  curSession?: string;
  Sessions: ISession[];
}

const initialState: UiState = JSON.parse(localStorage.getItem("chatHistory") || 'null') || {
  curSession: undefined,
  Sessions: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    changeQuestion: (state: UiState, action: PayloadAction<string>) => {
      const session = state.Sessions.find(session => session.id === state.curSession);
      if (session) {
        session.curQuestion = action.payload;
        session.history.push({
          id: session.history.length,
          msg: action.payload,
          msgType: 'question',
        });
      }
    },
    changeCurAnswer: (state: UiState, action: PayloadAction<string>) => {
      const session = state.Sessions.find(session => session.id === state.curSession);
      if (session) {
        if (session.history[session.history.length - 1].msgType === 'question') {
          session.history.push({
            id: session.history.length,
            msg: action.payload,
            msgType: 'answer',
          });
          return;
        }

        session.history[session.history.length - 1].msg = action.payload;
      }
    },
    changeOnProgress: (state: UiState, action: PayloadAction<boolean>) => {
      const session = state.Sessions.find(session => session.id === state.curSession);
      if (session) {
        session.onProgress = action.payload;
      }
    }
  },
});

export const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);

  localStorage.setItem("chatHistory", JSON.stringify(store.getState().ui));
  return result;
}

export const selectSendMsg = (state: rootState) => state.ui.Sessions.find(session => session.id === state.ui.curSession)?.curQuestion;
export const selectHistory = (state: rootState) => state.ui.Sessions.find(session => session.id === state.ui.curSession)?.history;
export const selectOnProgress = (state: rootState) => state.ui.Sessions.find(session => session.id === state.ui.curSession)?.onProgress;
