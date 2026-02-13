import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './myTailwind.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer
      // position="right-top"
      autoClose={1000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
      limit={5}   // max 5 toasts at a time
    />
  </StrictMode>,
)
