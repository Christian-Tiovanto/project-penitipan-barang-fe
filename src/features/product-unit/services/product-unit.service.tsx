import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://127.0.0.1:3000";

export const createProductUnit = async (productId: number, name: string, conversion_to_kg: number) => {
    try {
        const token = Cookies.get("auth_token");
        const response = await axios.post(`${API_URL}/api/v1/product-unit`, { productId, name, conversion_to_kg },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Product Unit failed";
    }
};

export const getAllProductUnits = async (pageSize: number, pageNo: number) => {
    try {
        const token = Cookies.get("auth_token");

        const response = await axios.get(`${API_URL}/api/v1/product-unit?page_size=${pageSize}&page_no=${pageNo}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "get all Product Unit failed";
    }
};

export const getProductUnitById = async (id: number) => {
    try {
        const token = Cookies.get("auth_token"); // Ambil token dari cookie

        const response = await axios.get(`${API_URL}/api/v1/product-unit/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "get Product Unit by id failed";
    }
};


export const updateProductUnitById = async (id: number, data: any) => {
    try {
        const token = Cookies.get("auth_token"); // Ambil token dari cookie

        const response = await axios.patch(`${API_URL}/api/v1/product-unit/${id}`,
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
        throw error.response?.data || "Update Product Unit by id failed";
    }
};

export const deleteProductUnitById = async (id: number) => {
    try {
        const token = Cookies.get("auth_token");

        const response = await axios.delete(`${API_URL}/api/v1/product-unit/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Delete Product Unit by id failed";
    }
};