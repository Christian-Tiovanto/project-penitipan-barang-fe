import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { ICustomerProductMutation } from "../pages/customer-product-mutation";
const URL = import.meta.env.VITE_API_URL;
export class CustomerProductMutationService {
  async getCustomerProductMutation(
    customerId: string,
    query?: {
      startDate: Date;
      endDate: Date;
    },
    config?: AxiosRequestConfig
  ) {
    const token = Cookies.get("auth_token");
    const queryParams: Record<string, string> = {};
    if (query?.startDate) {
      queryParams.start_date = query.startDate.toISOString();
    }
    if (query?.endDate) {
      queryParams.end_date = query.endDate.toISOString();
    }

    const response = await axios.get<ICustomerProductMutation[]>(
      `${URL}/api/v1/report/customer-mutation-stock/${customerId}`,
      {
        params: queryParams,
        signal: config?.signal,
        paramsSerializer: (params) => new URLSearchParams(params).toString(),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}
