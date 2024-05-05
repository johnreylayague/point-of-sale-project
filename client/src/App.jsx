import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import RootLayout from "./shared/layout/Body/Root";
// import SalesPage from "./pos/sales/pages/Sales";
// import ItemsPage from "./pos/items/pages/Items";
// import CategoriesPage from "./pos/items/pages/Categories";
// import ErrorPage from "./shared/error/pages/Error";
// import ItemsRootLayout from "./pos/items/pages/ItemsRootLayout";
import RootLayout from "./shared/layout/Main/pages/RootLayout";
import ErrorPage from "./shared/layout/Error/pages/Error";

import BackOfficeRootLayout from "./bo/root/pages/RootLayout";
import LoginPage from "./bo/login/pages/Login"; // action as loginUserAction,
import ResetPasswordPage from "./bo/resetPassword/pages/ResetPassword";
import ForgotPasswordPage from "./bo/forgotPassword/pages/ForgotPassword";
import SignUpPage from "./bo/signUp/pages/SignUp";

import POSRootLayout from "./pos/pages/root/pages/RootLayout";
import SalesPage from "./pos/pages/sales/pages/Sales";
import ItemsPage from "./pos/pages/items/pages/Items";

import "./App.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <SalesPage />,
        },
        {
          path: "bo",
          element: <BackOfficeRootLayout />,
          children: [
            {
              path: "login",
              element: <LoginPage />,
            },
            {
              path: "signup",
              element: <SignUpPage />,
            },
            {
              path: "resetpassword/:token",
              element: <ResetPasswordPage />,
            },
            {
              path: "forgotpassword",
              element: <ForgotPasswordPage />,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
