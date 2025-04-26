import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL; // Ganti dengan URL backend-mu

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
      email,
      password,
    });

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
  window.location.href = "/login"; // redirect manual
};

export const register = async (
  email: string,
  fullname: string,
  pin: string,
  password: string
  // role: string
) => {
  try {
    const token = Cookies.get("auth_token");
    const response = await axios.post(
      `${API_URL}/api/v1/auth/register`,
      { email, fullname, pin, password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Register failed";
  }
};

interface GetAllUsersParams {
  pageSize?: number;
  pageNo?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export const getAllUsers = async (params: GetAllUsersParams = {}) => {
  try {
    const token = Cookies.get("auth_token");

    const {
      pageSize = 10,
      pageNo = 1,
      search,
      sort,
      order,
      startDate,
      endDate,
    } = params;

    const queryParams = new URLSearchParams({
      page_size: pageSize.toString(),
      page_no: pageNo.toString(),
    });

    if (search) queryParams.append("search", search);
    if (sort) queryParams.append("sort", sort);
    if (order) queryParams.append("order", order);
    if (startDate) queryParams.append("start_date", startDate);
    if (endDate) queryParams.append("end_date", endDate);

    const response = await axios.get(
      `${API_URL}/api/v1/user?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Get all users failed";
  }
};

export const getUserById = async (id: number) => {
  try {
    const token = Cookies.get("auth_token"); // Ambil token dari cookie

    const response = await axios.get(`${API_URL}/api/v1/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
    const id: number = decoded.id;

    const response = await axios.get(`${API_URL}/api/v1/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "get User by id token failed";
  }
};

export const updateUserById = async (id: number, userData: any) => {
  try {
    const token = Cookies.get("auth_token"); // Ambil token dari cookie

    const response = await axios.patch(
      `${API_URL}/api/v1/user/${id}`,
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
    const id: number = decoded.id;

    const response = await axios.patch(
      `${API_URL}/api/v1/user/${id}`,
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

export const deleteUserById = async (id: number) => {
  try {
    const token = Cookies.get("auth_token"); // Ambil token dari cookie

    const response = await axios.delete(`${API_URL}/api/v1/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Delete User by id failed";
  }
};

export const updatePasswordByIdToken = async (
  oldPassword: string,
  password: string
) => {
  try {
    const token = Cookies.get("auth_token");

    if (!token) {
      console.error("Token is missing");
      return null;
    }

    const decoded: any = jwtDecode(token);
    const id: number = decoded.id;

    const response = await axios.patch(
      `${API_URL}/api/v1/user/${id}/update-password`,
      { oldPassword, password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Update Password failed";
  }
};
