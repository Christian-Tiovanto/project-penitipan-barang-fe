import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://127.0.0.1:3000";

export const createTransIn = async (
  customerId: number,
  productId: number,
  qty: number,
  unitId: number
) => {
  try {
    const token = Cookies.get("auth_token");
    const response = await axios.post(
      `${API_URL}/api/v1/transaction-in`,
      { customerId, productId, qty, unitId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Transaction In failed";
  }
};

export const getAllTransInsPagination = async (
  pageSize: number,
  pageNo: number,
  productId: number
) => {
  try {
    const token = Cookies.get("auth_token");

    const response = await axios.get(
      `${API_URL}/api/v1/transaction-in/by-product/${productId}?page_size=${pageSize}&page_no=${pageNo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "get all Trans in failed";
  }
};

// export const getAllTransIns = async () => {
//   try {
//     const token = Cookies.get("auth_token");

//     const response = await axios.get(`${API_URL}/api/v1/TransIn/all`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   } catch (error: any) {
//     throw error.response?.data || "get all TransIn failed";
//   }
// };

export const getTransInById = async (id: number) => {
  try {
    const token = Cookies.get("auth_token"); // Ambil token dari cookie

    const response = await axios.get(`${API_URL}/api/v1/transaction-in/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "get Transaction in by id failed";
  }
};

export const updateTransInById = async (id: number, data: any) => {
  try {
    const token = Cookies.get("auth_token");

    const response = await axios.patch(
      `${API_URL}/api/v1/transaction-in/${id}`,
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
    throw error.response?.data || "Update TransIn by id failed";
  }
};

// export const deleteTransInById = async (id: number) => {
//   try {
//     const token = Cookies.get("auth_token");

//     const response = await axios.delete(`${API_URL}/api/v1/TransIn/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     throw error.response?.data || "Delete TransIn by id failed";
//   }
// };
