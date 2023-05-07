import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { rootState } from "./";

export interface IMsg {
  id: number;
  msg: string;
  msgType: 'question' | 'answer';
}

export interface ISession {
  id: string;
  name: string;
  curQuestion: string;
  questionRepeat: number;
  onProgress: boolean;
  history: IMsg[];
}

export interface IInitSessionsPayload {
  id: string;
  name: string;
}

export interface UiState {
  curSessionId?: string;
  sessions: ISession[];
}

const initialState: UiState = {
  curSessionId: undefined,
  sessions: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    initSessions: (state: UiState, action: PayloadAction<IInitSessionsPayload[]>) => {
      state.sessions = action.payload.map(session => ({
        id: session.id,
        name: session.name,
        curQuestion: '',
        questionRepeat: 0,
        onProgress: false,
        history: [],
      }));
      state.curSessionId = action.payload[0]?.id;
    },
    addSession: (state: UiState, action: PayloadAction<string>) => {
      state.sessions.push({
        id: action.payload,
        name: 'New chat',
        curQuestion: '',
        questionRepeat: 0,
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
    initHistory: (state: UiState, action: PayloadAction<IMsg[]>) => {
      const session = state.sessions.find(session => session.id === state.curSessionId);
      if (session) {
        session.history = action.payload;
      }
    },
    // push question to history
    changeQuestion: (state: UiState, action: PayloadAction<string>) => {
      const session = state.sessions.find(session => session.id === state.curSessionId);
      if (session) {
        if (session.curQuestion === action.payload) {
          session.questionRepeat++;
        } else {
          session.questionRepeat = 0;
        }

        session.curQuestion = action.payload;
        session.history.push({
          id: session.history.length,
          msg: action.payload,
          msgType: 'question',
        });
      }
    },
    // push answer to history
    changeCurAnswer: (state: UiState, action: PayloadAction<string>) => {
      const session = state.sessions.find(session => session.id === state.curSessionId);
      if (session) {
        // if last msg is question, push new answer
        if (session.history[session.history.length - 1].msgType === 'question') {
          session.history.push({
            id: session.history.length,
            msg: action.payload,
            msgType: 'answer',
          });
          return;
        }

        // if last msg is answer, reset last msg
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

export const selectSendMsg = (state: rootState) => state.ui.sessions.find(session => session.id === state.ui.curSessionId)?.curQuestion;
export const selectquestionRepeat = (state: rootState) => state.ui.sessions.find(session => session.id === state.ui.curSessionId)?.questionRepeat;
export const selectHistory = (state: rootState) => state.ui.sessions.find(session => session.id === state.ui.curSessionId)?.history;
export const selectOnProgress = (state: rootState) => state.ui.sessions.find(session => session.id === state.ui.curSessionId)?.onProgress;
export const selectSessionIds = (state: rootState) => state.ui.sessions.map(session => session.id);
export const selectSessionNames = (state: rootState) => state.ui.sessions.map(session => session.name);
export const selectCurSessionId = (state: rootState) => state.ui.curSessionId;
