import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

window.Buffer = window.Buffer || require("buffer").Buffer;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);
