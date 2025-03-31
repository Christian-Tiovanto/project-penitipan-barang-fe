import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://127.0.0.1:3000"; // Ganti dengan URL backend-mu

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/v1/auth/login`, { email, password });

        const token = response.data.token;
        Cookies.set("auth_token", token, { expires: 1 }); // Expire dalam 1 hari

        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Login failed";
    }
};

// Function untuk mendapatkan token dari cookies
export const getToken = () => {
    return Cookies.get("auth_token");
};

// Function untuk logout (hapus token)
export const logout = () => {
    Cookies.remove("auth_token");
};

export const register = async (email: string, fullName: string, password: string, role: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/v1/auth/register`, { email, fullName, password, role });

        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Register failed";
    }
};

export const getAllUsers = async (pageSize: number, pageNo: number) => {
    try {
        const token = Cookies.get("auth_token"); // Ambil token dari cookie
        console.log(token)
        const response = await axios.get(`${API_URL}/api/v1/user?page_size=${pageSize}&page_no=${pageNo}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "get all Users failed";
    }
};

export const getUserById = async (id: number) => {
    try {
        const token = Cookies.get("auth_token"); // Ambil token dari cookie

        const response = await axios.get(`${API_URL}/api/v1/user/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "get User by id failed";
    }
};

export const getUserByIdToken = async () => {
    try {
        const token = Cookies.get("auth_token"); // Ambil token dari cookie

        if (!token) {
            console.error("Token is missing");
            return null;
        }

        const decoded: any = jwtDecode(token);
        const id: number = decoded.id

        const response = await axios.get(`${API_URL}/api/v1/user/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "get User by id token failed";
    }
};

export const updateUserById = async (id: number, userData: any) => {
    try {
        const token = Cookies.get("auth_token"); // Ambil token dari cookie

        const response = await axios.patch(`${API_URL}/api/v1/user/${id}`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Update User by id failed";
    }
};

export const updateUserByIdToken = async (userData: any) => {
    try {
        const token = Cookies.get("auth_token");

        if (!token) {
            console.error("Token is missing");
            return null;
        }

        const decoded: any = jwtDecode(token);
        const id: number = decoded.id

        const response = await axios.patch(`${API_URL}/api/v1/user/${id}`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Update User by id token failed";
    }
};

