import axios from 'axios';

export const selectUsers = (userId: number) => {
  return axios.post(
    'http://localhost:5000/api/users', {
    user_id: userId,
  });
}

export const addMessage = (sessionId: string, content: string, question: boolean) => {
  return axios.post(
    'http://localhost:5000/api/message_add', {
    session_id: sessionId,
    content: content,
    question: question,
  });
}

export const addSession = (userId: number, sessionId: string) => {
  return axios.post(
    'http://localhost:5000/api/session_add', {
    user_id: userId,
    session_id: sessionId,
    name: 'New chat',
  });
}

export const renameSession = (sessionId: string, name: string) => {
  return axios.post(
    'http://localhost:5000/api/session_rename', {
    session_id: sessionId,
    name: name,
  });
}

export const deleteSession = (sessionId: string) => {
  return axios.post(
    'http://localhost:5000/api/session_delete', {
    session_id: sessionId,
  });
}