import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://127.0.0.1:3000";

export const createCustomerPayment = async (customerId: number, payment_methodId: number, charge: number, status: boolean, min_pay: number) => {
    try {
        const token = Cookies.get("auth_token");
        const response = await axios.post(`${API_URL}/api/v1/customer-payment`, { customerId, payment_methodId, charge, status, min_pay },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Customer Payment failed";
    }
};

export const getAllCustomerPayments = async (pageSize: number, pageNo: number) => {
    try {
        const token = Cookies.get("auth_token");

        const response = await axios.get(`${API_URL}/api/v1/customer-payment?page_size=${pageSize}&page_no=${pageNo}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "get all Customer Payment failed";
    }
};

export const getCustomerPaymentById = async (id: number) => {
    try {
        const token = Cookies.get("auth_token"); // Ambil token dari cookie

        const response = await axios.get(`${API_URL}/api/v1/customer-payment/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "get Customer Payment by id failed";
    }
};


export const updateCustomerPaymentById = async (id: number, data: any) => {
    try {
        const token = Cookies.get("auth_token"); // Ambil token dari cookie

        const response = await axios.patch(`${API_URL}/api/v1/customer-payment/${id}`,
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
        throw error.response?.data || "Update Customer Payment by id failed";
    }
};

export const deleteCustomerPaymentById = async (id: number) => {
    try {
        const token = Cookies.get("auth_token");

        const response = await axios.delete(`${API_URL}/api/v1/customer-payment/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Delete Customer Payment by id failed";
    }
};