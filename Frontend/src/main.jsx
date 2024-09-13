import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from './context/AuthContext.jsx';
import ThemeProviders from './Components/Providers/ThemeProvider.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProviders>
        <AuthContextProvider>
          <ToastContainer
            theme="light"
            position='top-center'
            autoClose={2000}
            closeOnClick={true}
            pauseOnFocusLoss={false}
            pauseOnHover={false}
            toastClassName=".toast-message"
          />
          <App />
        </AuthContextProvider>
      </ThemeProviders>
    </BrowserRouter>
  </React.StrictMode>
)
