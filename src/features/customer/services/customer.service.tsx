import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://127.0.0.1:3000";

export const createCustomer = async (name: string, code: string, address: string) => {
    try {
        const token = Cookies.get("auth_token");
        const response = await axios.post(`${API_URL}/api/v1/customer`, { name, code, address },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Customer failed";
    }
};

export const getAllCustomersPagination = async (pageSize: number, pageNo: number) => {
    try {
        const token = Cookies.get("auth_token");

        const response = await axios.get(`${API_URL}/api/v1/customer?page_size=${pageSize}&page_no=${pageNo}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "get all Customer failed";
    }
};

export const getAllCustomers = async () => {
    try {
        const token = Cookies.get("auth_token");

        const response = await axios.get(`${API_URL}/api/v1/customer/all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "get all Customer failed";
    }
};

export const getCustomerById = async (id: number) => {
    try {
        const token = Cookies.get("auth_token");

        const response = await axios.get(`${API_URL}/api/v1/customer/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "get Customer by id failed";
    }
};


export const updateCustomerById = async (id: number, data: any) => {
    try {
        const token = Cookies.get("auth_token");

        const response = await axios.patch(`${API_URL}/api/v1/customer/${id}`,
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
        throw error.response?.data || "Update Customer by id failed";
    }
};

export const deleteCustomerById = async (id: number) => {
    try {
        const token = Cookies.get("auth_token");

        const response = await axios.delete(`${API_URL}/api/v1/customer/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Delete Customer by id failed";
    }
};