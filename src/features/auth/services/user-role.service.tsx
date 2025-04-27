import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL; // Ganti dengan URL backend-mu

export const createUserRole = async (userId: number, role: string) => {
  try {
    const token = Cookies.get("auth_token");

    if (!token) {
      console.error("Token is missing");
      return null;
    }

    const response = await axios.post(
      `${API_URL}/api/v1/user-role`,
      { userId, role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Create user role failed";
  }
};

export const deleteUserRole = async (userId: number, role: string) => {
  try {
    const token = Cookies.get("auth_token");

    if (!token) {
      console.error("Token is missing");
      return null;
    }

    const response = await axios.delete(`${API_URL}/api/v1/user-role`, {
      data: { userId, role }, // <-- data harus di dalam object 'data'
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "delete user role failed";
  }
};
