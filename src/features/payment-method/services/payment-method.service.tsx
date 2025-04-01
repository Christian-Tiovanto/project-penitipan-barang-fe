import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://127.0.0.1:3000";

export const createPaymentMethod = async (name: string) => {
    try {
        const token = Cookies.get("auth_token");
        const response = await axios.post(`${API_URL}/api/v1/payment-method`, { name },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Payment Method failed";
    }
};

export const getAllPaymentMethods = async (pageSize: number, pageNo: number) => {
    try {
        const token = Cookies.get("auth_token");

        const response = await axios.get(`${API_URL}/api/v1/payment-method?page_size=${pageSize}&page_no=${pageNo}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "get all Payment Method failed";
    }
};

export const getPaymentMethodById = async (id: number) => {
    try {
        const token = Cookies.get("auth_token"); // Ambil token dari cookie

        const response = await axios.get(`${API_URL}/api/v1/payment-method/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "get Payment Method by id failed";
    }
};


export const updatePaymentMethodById = async (id: number, data: any) => {
    try {
        const token = Cookies.get("auth_token"); // Ambil token dari cookie

        const response = await axios.patch(`${API_URL}/api/v1/payment-method/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Update PaymentMethod by id failed";
    }
};

export const deletePaymentMethodById = async (id: number) => {
    try {
        const token = Cookies.get("auth_token");

        const response = await axios.delete(`${API_URL}/api/v1/payment-method/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Delete Payment Method by id failed";
    }
};