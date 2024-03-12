import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <ToastContainer 
            theme="light" 
            position='top-center' 
            autoClose={3000}
            closeOnClick
            pauseOnHover={false}
            className="w-[40px] text-green-50 h-[10px]"
        />
        <App />
    </BrowserRouter>
  </React.StrictMode>,
)
