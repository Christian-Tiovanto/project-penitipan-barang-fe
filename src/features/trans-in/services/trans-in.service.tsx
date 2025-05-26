import axios from "axios";
import Cookies from "js-cookie";
import { PaginationMetaData } from "../../../interfaces/pagination-meta";

const API_URL = import.meta.env.VITE_API_URL;

interface GetAllTransInsPaginationByHeaderIdParams {
  pageSize?: number;
  pageNo?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

interface GetAllTransInHeaderPaginationParams {
  pageSize?: number;
  pageNo?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export const createTransIn = async (data: any) => {
  try {
    console.log(data);
    const token = Cookies.get("auth_token");
    const response = await axios.post(
      `${API_URL}/api/v1/transaction-in/bulk`,
      data,
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
//   pageSize: number,
//   pageNo: number,
//   productId: number
// ) => {
//   try {
//     const token = Cookies.get("auth_token");

//     const response = await axios.get(
//       `${API_URL}/api/v1/transaction-in/by-product/${productId}?page_size=${pageSize}&page_no=${pageNo}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error: any) {
//     throw error.response?.data || "get all Trans in failed";
//   }
// };

export const getAllTransInsPaginationByHeaderId = async (
  headerId: number,
  params: GetAllTransInsPaginationByHeaderIdParams = {}
): Promise<PaginationMetaData<any>> => {
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
      `${API_URL}/api/v1/transaction-in/by-header/${headerId}?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Get all transaction in by product id failed";
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

export const getAllTransInHeaderByCustomerId = async (customerId: number) => {
  try {
    const token = Cookies.get("auth_token"); // Ambil token dari cookie

    const response = await axios.get(
      `${API_URL}/api/v1/transaction-in-header/by-customer/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data ||
      "get Transaction in Header by customer id by id failed"
    );
  }
};

export const getAllTransInHeaderPagination = async (
  params: GetAllTransInHeaderPaginationParams = {}
) => {
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
      `${API_URL}/api/v1/transaction-in-header?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Get all transaction in header failed";
  }
};

export const getTransInHeaderById = async (id: number) => {
  try {
    const token = Cookies.get("auth_token"); // Ambil token dari cookie

    const response = await axios.get(
      `${API_URL}/api/v1/transaction-in-header/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "get Transaction in header by id failed";
  }
};

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

export const updateTransInHeaderById = async (id: number, data: any) => {
  try {
    const token = Cookies.get("auth_token");

    const response = await axios.patch(
      `${API_URL}/api/v1/transaction-in-header/${id}`,
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
    throw error.response?.data || "Update TransIn Header by id failed";
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
