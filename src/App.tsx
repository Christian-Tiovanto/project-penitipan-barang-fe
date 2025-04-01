import { createBrowserRouter, RouterProvider } from "react-router"; // Import yang benar dari react-router-dom
import "./App.css";
import MainLayout from "./layouts/layouts";
import { ReportInPage } from "./features/report/report-in";
import { CreateUserPage, LoginPage, ChangePasswordPage, UserPage, ProfilePage, UpdateUserPage } from './features/auth'
import { MasterPage } from "./features/master";
import { ReportOutPage } from "./features/report/report-out";
import { ToastProvider } from "./contexts/toastContexts";
import { CreatePaymentMethodPage, PaymentMethodPage } from "./features/payment-method";
import UpdatePaymentMethodPage from "./features/payment-method/pages/update-payment-method";
import { ChargePage } from "./features/charge";

function ExampleRouting() {
  return (
    <h1>tes</h1>
  );
}

const router = createBrowserRouter([
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
        element: <ChangePasswordPage />
      },
      {
        path: "master/user",
        element: <UserPage />
      },
      {
        path: "master/payment-method",
        element: <PaymentMethodPage />
      },
      {
        path: "master/payment-method/create-payment-method",
        element: <CreatePaymentMethodPage />
      },
      {
        path: "master/payment-method/edit-payment-method/:id",
        element: <UpdatePaymentMethodPage />
      },
      {
        path: "master/user/create-user",
        element: <CreateUserPage />
      },
      {
        path: "master/user/edit-user/:id",
        element: <UpdateUserPage />
      },
      {
        path: "master/profile",
        element: <ProfilePage />
      },
      {
        path: "master/charge",
        element: <ChargePage />
      }
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  }
]);

function App() {
  return (
    <ToastProvider> {/* Wrap the entire app with ToastProvider */}
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
