import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

interface GetAllCustomersPaginationParams {
  pageSize?: number;
  pageNo?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export const createCustomer = async (
  name: string,
  code: string,
  address: string
) => {
  try {
    const token = Cookies.get("auth_token");
    const response = await axios.post(
      `${API_URL}/api/v1/customer`,
      { name, code, address },
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

export const getAllCustomersPagination = async (
  params: GetAllCustomersPaginationParams = {}
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
      `${API_URL}/api/v1/customer?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Get all customer failed";
  }
};

export const getAllCustomers = async () => {
  try {
    const token = Cookies.get("auth_token");

    const response = await axios.get(`${API_URL}/api/v1/customer/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "get all Customer failed";
  }
};

export const getCustomerById = async (id: number) => {
  try {
    const token = Cookies.get("auth_token");

    const response = await axios.get(`${API_URL}/api/v1/customer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "get Customer by id failed";
  }
};

export const updateCustomerById = async (id: number, data: any) => {
  try {
    const token = Cookies.get("auth_token");

    const response = await axios.patch(
      `${API_URL}/api/v1/customer/${id}`,
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

    const response = await axios.delete(`${API_URL}/api/v1/customer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Delete Customer by id failed";
  }
};
