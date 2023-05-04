import { createSlice, PayloadAction, Middleware } from "@reduxjs/toolkit";
import { rootState } from "./";

export interface IMsg {
  id: number;
  msg: string;
  msgType: 'question' | 'answer';
}

export interface  ISession {
  id: string;
  name: string;
  curQuestion: string;
  onProgress: boolean;
  history: IMsg[];
}

export interface UiState {
  curSessionId?: string;
  sessions: ISession[];
}

const initialState: UiState = JSON.parse(localStorage.getItem("chatHistory") || 'null') || {
  curSessionId: undefined,
  sessions: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    addSession: (state: UiState, action: PayloadAction<string>) => {
      state.sessions.push({
        id: action.payload,
        name: 'New chat',
        curQuestion: '',
        onProgress: false,
        history: [],
      });
      state.curSessionId = action.payload;
    },
    changeCurSessionId: (state: UiState, action: PayloadAction<string>) => {
      state.curSessionId = action.payload;
    },
    renameSession: (state: UiState, action: PayloadAction<{ id: string, name: string }>) => {
      const session = state.sessions.find(session => session.id === action.payload.id);
      if (session) {
        session.name = action.payload.name;
      }
    },
    deleteSession: (state: UiState, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(session => session.id !== action.payload);
    },
    changeQuestion: (state: UiState, action: PayloadAction<string>) => {
      const session = state.sessions.find(session => session.id === state.curSessionId);
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
      const session = state.sessions.find(session => session.id === state.curSessionId);
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
      const session = state.sessions.find(session => session.id === state.curSessionId);
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

export const selectSendMsg = (state: rootState) => state.ui.sessions.find(session => session.id === state.ui.curSessionId)?.curQuestion;
export const selectHistory = (state: rootState) => state.ui.sessions.find(session => session.id === state.ui.curSessionId)?.history;
export const selectOnProgress = (state: rootState) => state.ui.sessions.find(session => session.id === state.ui.curSessionId)?.onProgress;
export const selectSessionIds = (state: rootState) => state.ui.sessions.map(session => session.id);
export const selectSessionNames = (state: rootState) => state.ui.sessions.map(session => session.name);
export const selectCurSessionId = (state: rootState) => state.ui.curSessionId;
