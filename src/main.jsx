import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

//react router
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

//toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './contexts/AuthContext';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <ToastContainer />
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
