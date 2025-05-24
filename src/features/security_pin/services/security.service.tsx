import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

export const getSecurityPin = async () => {
  try {
    const token = Cookies.get("auth_token");
    const id = 1;
    const response = await axios.get(
      `${API_URL}/api/v1/app-settings/security-pin`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "get Charge by id failed";
  }
};

export const updateSecurityPin = async (data: { setting_value: number }) => {
  try {
    const token = Cookies.get("auth_token");

    const response = await axios.patch(
      `${API_URL}/api/v1/app-settings/security-pin`,
      { setting_value: data.setting_value.toString() },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Update Charge by id failed";
  }
};
