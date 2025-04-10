import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://127.0.0.1:3000";

interface GetAllProductsPaginationParams {
  pageSize?: number;
  pageNo?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export const createProduct = async (
  name: string,
  price: number,
  // qty: number,
  desc: string
) => {
  try {
    const token = Cookies.get("auth_token");
    const qty = 0;
    const response = await axios.post(
      `${API_URL}/api/v1/product`,
      { name, price, qty, desc },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Product failed";
  }
};

export const getAllProductsPagination = async (
  params: GetAllProductsPaginationParams = {}
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
      `${API_URL}/api/v1/product?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Get all products failed";
  }
};

export const getAllProducts = async () => {
  try {
    const token = Cookies.get("auth_token");

    const response = await axios.get(`${API_URL}/api/v1/product/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "get all Product failed";
  }
};

export const getProductById = async (id: number) => {
  try {
    const token = Cookies.get("auth_token"); // Ambil token dari cookie

    const response = await axios.get(`${API_URL}/api/v1/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "get Product by id failed";
  }
};

export const updateProductById = async (id: number, data: any) => {
  try {
    const token = Cookies.get("auth_token");

    const response = await axios.patch(
      `${API_URL}/api/v1/product/${id}`,
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
    throw error.response?.data || "Update Product by id failed";
  }
};

export const deleteProductById = async (id: number) => {
  try {
    const token = Cookies.get("auth_token");

    const response = await axios.delete(`${API_URL}/api/v1/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Delete Product by id failed";
  }
};
