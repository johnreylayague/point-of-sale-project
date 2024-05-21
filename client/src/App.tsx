import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import ErrorPage from "./shared/Layout/Error/pages/Error";
import SalesPage from "./pos/Sales/pages/Sales";
import POSRootLayout from "./pos/Root/pages/PosRootLayout";
import ListItemsPage from "./pos/Items/pages/ListItems";
import CategoriesPage from "./pos/Categories/pages/Categories";
import LoginPage from "./bo/Login/pages/Login";
import SignUpPage from "./bo/SignUp/pages/SignUp";
import ResetPasswordPage from "./bo/ResetPassword/pages/ResetPassword";
import ForgotPasswordPage from "./bo/ForgotPassword/pages/ForgotPassword";
import EditCategoriesPage from "./pos/Categories/pages/EditCategories";
import EditItemsPage from "./pos/Items/pages/EditItems";
import NewItemPage from "./pos/Items/pages/NewItem";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route
        path="/"
        element={<Navigate to={"bo/login"} />}
        errorElement={<ErrorPage />}
      />,
      <Route path="/bo/login" element={<LoginPage />}></Route>,
      <Route path="/bo/signup" element={<SignUpPage />}></Route>,
      <Route
        path="/bo/resetpassword/:token"
        element={<ResetPasswordPage />}
      ></Route>,
      <Route
        path="/bo/forgotpassword"
        element={<ForgotPasswordPage />}
      ></Route>,
      <Route path="pos" element={<POSRootLayout />}>
        <Route path="sales" element={<SalesPage />}></Route>
        <Route path="items" element={<ListItemsPage />}></Route>
        <Route path="items/new" element={<NewItemPage />}></Route>
        <Route path="items/edit/:itemId" element={<EditItemsPage />}></Route>
        <Route path="categories" element={<CategoriesPage />}></Route>
        <Route
          path="categories/:categoryId"
          element={<EditCategoriesPage />}
        ></Route>
      </Route>,
    ])
  );

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
