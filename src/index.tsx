import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import App from './app/App';
import { store } from "./store";
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";

window.Buffer = window.Buffer || require("buffer").Buffer;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
