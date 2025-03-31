import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import MainLayout from "./layouts/layouts";
import { ReportInPage } from "./features/report/report-in";
import DatePicker from "./components/date-picker";
import { CreateUserPage, LoginPage, ChangePasswordPage, UserPage, ProfilePage, UpdateUserPage } from './features/auth'
import { Component } from "react";
import { MasterPage } from "./features/master";


function ExampleRouting() {
  return (
    <>
      <h1>tes</h1>
    </>
  );
}


const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { path: "example", Component: ExampleRouting },
      {
        path: "report",
        children: [{ path: "transaction-in", Component: ReportInPage }],
      },
      {
        path: "master",
        Component: MasterPage,
      },
      {
        path: "master/change-password",
        Component: ChangePasswordPage
      },
      {
        path: "master/user",
        Component: UserPage
      },
      {
        path: "master/user/create-user",
        Component: CreateUserPage
      },
      {
        path: "master/user/edit-user/:id",
        Component: UpdateUserPage
      },
      {
        path: "master/profile",
        Component: ProfilePage
      }
    ],
  },
  {
    path: "login",
    Component: LoginPage,
  }
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}
// const root: any = document.getElementById("root");
export default App;
