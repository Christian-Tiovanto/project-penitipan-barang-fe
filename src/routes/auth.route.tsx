import { createBrowserRouter } from "react-router";
import { LoginPage } from "../features/auth"; // Sesuaikan path jika berbeda

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />, // Ini akan menampilkan LoginPage saat user ke "/"
    },
    {
        path: "/forgot-password",
        element: <h1>Forgot Password Page</h1>, // Bisa diganti dengan komponen yang sesuai
    },
]);

export default router;
