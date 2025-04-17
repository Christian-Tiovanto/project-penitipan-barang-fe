import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

interface GetAllProductUnitsParams {
  pageSize?: number;
  pageNo?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export const createProductUnit = async (
  productId: number,
  name: string,
  conversion_to_kg: number
) => {
  try {
    const token = Cookies.get("auth_token");
    const response = await axios.post(
      `${API_URL}/api/v1/product-unit`,
      { productId, name, conversion_to_kg },
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

export const getAllProductUnits = async (
  params: GetAllProductUnitsParams = {}
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
      `${API_URL}/api/v1/product-unit?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Get all product units failed";
  }
};

export const getProductUnitById = async (id: number) => {
  try {
    const token = Cookies.get("auth_token"); // Ambil token dari cookie

    const response = await axios.get(`${API_URL}/api/v1/product-unit/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "get Product Unit by id failed";
  }
};

export const updateProductUnitById = async (id: number, data: any) => {
  try {
    const token = Cookies.get("auth_token"); // Ambil token dari cookie

    const response = await axios.patch(
      `${API_URL}/api/v1/product-unit/${id}`,
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

    const response = await axios.delete(
      `${API_URL}/api/v1/product-unit/${id}`,
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

export const getProductUnitsByProductId = async (productId: number) => {
  try {
    const token = Cookies.get("auth_token");
    const response = await axios.get(
      `${API_URL}/api/v1/product-unit/by-product/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "get all Product Unit by product id failed";
  }
};
