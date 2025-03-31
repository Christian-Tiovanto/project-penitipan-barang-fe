// import { useState } from "react";
// // import { login } from "../services/authService";

// export const useAuth = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const handleLogin = async (email: string, password: string) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const user = await login(email, password);
//             console.log("Login success:", user);
//         } catch (err) {
//             setError("Invalid email or password");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { handleLogin, loading, error };
// };
