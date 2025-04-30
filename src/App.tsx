import { createBrowserRouter, RouterProvider } from "react-router"; // Import yang benar dari react-router-dom
import "./App.css";
import MainLayout from "./layouts/layouts";
import { ReportInPage } from "./features/report/pages/report-in";
import {
  CreateUserPage,
  LoginPage,
  ChangePasswordPage,
  UserPage,
  ProfilePage,
  UpdateUserPage,
  CreateUserRolePage,
} from "./features/auth";
import { MasterPage } from "./features/master";
import { ReportOutPage } from "./features/report/pages/report-out";
import { ToastProvider } from "./contexts/toastContexts";
import {
  CreatePaymentMethodPage,
  PaymentMethodPage,
} from "./features/payment-method";
import UpdatePaymentMethodPage from "./features/payment-method/pages/update-payment-method";
import { ChargePage } from "./features/charge";

import UpdateProductUnitPage from "./features/product-unit/pages/update-product-unit";
import {
  CreateProductUnitPage,
  ProductUnitPage,
} from "./features/product-unit";
import { CreateProductPage, ProductPage } from "./features/product";
import UpdateProductPage from "./features/product/pages/update-product";
import CreateCashFlow from "./features/cashflow/cashflow-page";
import { ArReportPaidPage } from "./features/report/pages/ar-report-paid";
import { ArToPaidPage } from "./features/report/pages/ar-to-paid";
import { CustomerProductStockPage } from "./features/report/pages/customer-product-stock";
import { StockBookPage } from "./features/report/pages/stock-book";
import { StockReportPage } from "./features/report/pages/stock-report";
import { NettIncomeReportPage } from "./features/report/pages/nett-income-report";
import ArListPage from "./features/report/pages/ar-list";
import { CreateCustomerPage, CustomerPage } from "./features/customer";
import UpdateCustomerPage from "./features/customer/pages/update-customer";
import {
  CreateCustomerPaymentPage,
  CustomerPaymentPage,
} from "./features/customer-payment";
import UpdateCustomerPaymentPage from "./features/customer-payment/pages/update-customer-payment";
import { TransactionPage } from "./features/transaction";
import { CreateTransInPage, TransInPage } from "./features/trans-in";
import TransInHistoryPage from "./features/trans-in/pages/history-trans-in";
import UpdateTransInPage from "./features/trans-in/pages/update-trans-in";
import { CostReportPage } from "./features/report/pages/cost-report";
import InvoiceListPage from "./features/report/pages/invoice-list";
import CreateTransOutPage from "./features/trans-out/pages/create-trans-out";
import ReportPage from "./features/report/report-page";
import { StockInvoiceReportPage } from "./features/report/pages/stock-invoice-report";
import { AgingReportPage } from "./features/report/pages/aging-report";
import { CustomerProductMutationPage } from "./features/report/pages/customer-product-mutation";
// import CreateTrans from "./features/trans-in/pages/create-trans";

const router = createBrowserRouter([
  { path: "create-cashflow", element: <CreateCashFlow /> },
  {
    path: "/",
    element: <MainLayout />, // Gunakan element bukan Component
    children: [
      {
        path: "report",
        children: [
          { index: true, element: <ReportPage /> },
          { path: "transaction-in", element: <ReportInPage /> },
          { path: "transaction-out", element: <ReportOutPage /> },
          { path: "paidoff", element: <ArReportPaidPage /> },
          { path: "ar-to-paid", element: <ArToPaidPage /> },
          {
            path: "customer-product-stock",
            element: <CustomerProductStockPage />,
          },
          {
            path: "stock-book",
            element: <StockBookPage />,
          },
          {
            path: "stock-report",
            element: <StockReportPage />,
          },
          {
            path: "stock-invoice-report",
            element: <StockInvoiceReportPage />,
          },
          {
            path: "nett-income",
            element: <NettIncomeReportPage />,
          },
          {
            path: "ar-list",
            element: <ArListPage />,
          },
          {
            path: "invoice-list",
            element: <InvoiceListPage />,
          },
          {
            path: "cost-report",
            element: <CostReportPage />,
          },
          {
            path: "aging-report",
            element: <AgingReportPage />,
          },
          {
            path: "customer-product-mutation",
            element: <CustomerProductMutationPage />,
          },
        ],
      },
      {
        path: "master",
        element: <MasterPage />,
      },
      {
        path: "cashflow",
        element: <CreateCashFlow />,
      },
      {
        path: "transaction",
        element: <TransactionPage />,
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
        path: "master/user/create-user-role/:id",
        element: <CreateUserRolePage />,
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
        element: <ChargePage />,
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
      {
        path: "transaction/in",
        element: <TransInPage />,
      },
      {
        path: "transaction/in/create-in",
        element: <CreateTransInPage />,
      },
      {
        path: "transaction/in/history-in/:id",
        element: <TransInHistoryPage />,
      },
      {
        path: "transaction/in/edit-in/:id",
        element: <UpdateTransInPage />,
      },
      {
        path: "transaction/out/create-out",
        element: <CreateTransOutPage />,
      },
      // {
      //   path: "test",
      //   element: <CreateTrans />,
      // },
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
