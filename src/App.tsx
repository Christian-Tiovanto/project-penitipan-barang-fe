import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import MainLayout from "./layouts/layouts";

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
    children: [{ path: "example", Component: ExampleRouting }],
  },
]);
function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
