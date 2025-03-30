import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import MainLayout from "./layouts/layouts";
import { ReportInPage } from "./features/report/report-in";
import DatePicker from "./components/date-picker";

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
    ],
  },
]);
function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
