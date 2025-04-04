import { createBrowserRouter, RouterProvider } from "react-router"; // Import yang benar dari react-router-dom
import "./App.css";
import MainLayout from "./layouts/layouts";
import { ReportInPage } from "./features/report/report-in";
import {
  CreateUserPage,
  LoginPage,
  ChangePasswordPage,
  UserPage,
  ProfilePage,
  UpdateUserPage,
} from "./features/auth";
import { MasterPage } from "./features/master";
import { ReportOutPage } from "./features/report/report-out";
import { ToastProvider } from "./contexts/toastContexts";
import {
  CreatePaymentMethodPage,
  PaymentMethodPage,
} from "./features/payment-method";
import UpdatePaymentMethodPage from "./features/payment-method/pages/update-payment-method";
import { ChargePage } from "./features/charge";

import UpdateProductUnitPage from "./features/product-unit/pages/update-product-unit";
import { CreateProductUnitPage, ProductUnitPage } from "./features/product-unit";
import { CreateProductPage, ProductPage } from "./features/product";
import UpdateProductPage from "./features/product/pages/update-product";
import CreateCashFlow from "./features/cashflow/cashflow-page";
import { CreateCustomerPage, CustomerPage } from "./features/customer";
import UpdateCustomerPage from "./features/customer/pages/update-customer";
import { CreateCustomerPaymentPage, CustomerPaymentPage } from "./features/customer-payment";
import UpdateCustomerPaymentPage from "./features/customer-payment/pages/update-customer-payment";

function ExampleRouting() {
  return <h1>tes</h1>;
}

const router = createBrowserRouter([
  { path: "create-cashflow", element: <CreateCashFlow /> },
  {
    path: "/",
    element: <MainLayout />, // Gunakan element bukan Component
    children: [
      { path: "example", element: <ExampleRouting /> },
      {
        path: "report",
        children: [
          { path: "transaction-in", element: <ReportInPage /> },
          { path: "transaction-out", element: <ReportOutPage /> },
        ],
      },
      {
        path: "master",
        element: <MasterPage />,
      },
      {
        path: "master/change-password",
        element: <ChangePasswordPage />,
      },
      {
        path: "master/user",
        element: <UserPage />,
      },
      {
        path: "master/payment-method",
        element: <PaymentMethodPage />,
      },
      {
        path: "master/payment-method/create-payment-method",
        element: <CreatePaymentMethodPage />,
      },
      {
        path: "master/payment-method/edit-payment-method/:id",
        element: <UpdatePaymentMethodPage />,
      },
      {
        path: "master/user/create-user",
        element: <CreateUserPage />,
      },
      {
        path: "master/user/edit-user/:id",
        element: <UpdateUserPage />,
      },
      {
        path: "master/profile",
        element: <ProfilePage />,
      },
      {
        path: "master/charge",
        element: <ChargePage />
      },
      {
        path: "master/product-unit",
        element: <ProductUnitPage />,
      },
      {
        path: "master/product-unit/create-product-unit",
        element: <CreateProductUnitPage />,
      },
      {
        path: "master/product-unit/edit-product-unit/:id",
        element: <UpdateProductUnitPage />,
      },
      {
        path: "master/product",
        element: <ProductPage />,
      },
      {
        path: "master/product/create-product",
        element: <CreateProductPage />,
      },
      {
        path: "master/product/edit-product/:id",
        element: <UpdateProductPage />,
      },
      {
        path: "master/customer",
        element: <CustomerPage />,
      },
      {
        path: "master/customer/create-customer",
        element: <CreateCustomerPage />,
      },
      {
        path: "master/customer/edit-customer/:id",
        element: <UpdateCustomerPage />,
      },
      {
        path: "master/customer-payment",
        element: <CustomerPaymentPage />,
      },
      {
        path: "master/customer-payment/create-customer-payment",
        element: <CreateCustomerPaymentPage />,
      },
      {
        path: "master/customer-payment/edit-customer-payment/:id",
        element: <UpdateCustomerPaymentPage />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
]);

function App() {
  return (
    <ToastProvider>
      {" "}
      {/* Wrap the entire app with ToastProvider */}
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
