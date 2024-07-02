import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Todos from "./pages/Todos";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedPage from "./components/ProtectedPage";
import AuthProvider from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedPage>
        <Todos />
      </ProtectedPage>
    ),
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    <ToastContainer theme="colored" />
  </React.StrictMode>
);
