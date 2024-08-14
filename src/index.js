import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

axios.defaults.baseURL='http://192.168.1.97:8000/'
//axios.defaults.baseURL='https://picklelo-backend.onrender.com/'
//axios.defaults.baseURL='https://resident-caty-picklelo-7b1f1d19.koyeb.app/'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
