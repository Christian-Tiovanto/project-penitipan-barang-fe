import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://127.0.0.1:3000";

export const createCharge = async (amount: number) => {
    try {
        const type: string = "nominal"
        const token = Cookies.get("auth_token");
        const response = await axios.post(`${API_URL}/api/v1/charge`, { type, amount },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Create Charge failed";
    }
};

export const getChargeById = async () => {
    try {
        const token = Cookies.get("auth_token");
        const id = 1;
        const response = await axios.get(`${API_URL}/api/v1/charge/${id}`,
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


export const updateChargeById = async (data: any) => {
    try {
        const token = Cookies.get("auth_token");
        const id = 1

        const response = await axios.patch(`${API_URL}/api/v1/charge/${id}`,
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
        throw error.response?.data || "Update Charge by id failed";
    }
};

