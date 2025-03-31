import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import MainLayout from "./layouts/layouts";
import { ReportInPage } from "./features/report/report-in";
import { ReportOutPage } from "./features/report/report-out";

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
        children: [
          { path: "transaction-in", Component: ReportInPage },
          { path: "transaction-out", Component: ReportOutPage },
        ],
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
