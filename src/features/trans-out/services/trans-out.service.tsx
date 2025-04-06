import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://127.0.0.1:3000";

export const createTransOut = async (
  customerId: number,
  noPlat: string,
  // clockOut: string, // ISO date string
  transactionOuts: {
    productId: number;
    converted_qty: number;
  }[]
) => {
  try {
    const token = Cookies.get("auth_token");
    const response = await axios.post(
      `${API_URL}/api/v1/transaction-out`,
      {
        customerId,
        no_plat: noPlat,
        // clock_out: clockOut,
        transaction_outs: transactionOuts,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Transaction Out failed";
  }
};
