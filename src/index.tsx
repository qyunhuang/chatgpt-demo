import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import App from './app/App';
import { store } from "./store";
import { Provider } from 'react-redux';

window.Buffer = window.Buffer || require("buffer").Buffer;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
