import axios from 'axios';

export const selectUsers = (userId: number) => {
  return axios.post(
    'http://localhost:5000/api/users', {
    user_id: userId
  });
}

export const addMessage = (sessionId: number, content: string, question: boolean) => {
  return axios.post(
    'http://localhost:5000/api/messages', {
    session_id: sessionId,
    content: content,
    question: question
  });
}
