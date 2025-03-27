import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import ReactDOM from 'react-dom/client'

function Tes() {
  return (
    <>
    <h1>Test asdf</h1>
    </>
  )
}
const router = createBrowserRouter([{
  path:"/",
  Component:Tes}])
function App() {

  return <RouterProvider router={router}></RouterProvider>
}
const root:any = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />
);
export default App
