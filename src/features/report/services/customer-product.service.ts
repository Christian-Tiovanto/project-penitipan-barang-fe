import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { Order } from "../../../enum/SortOrder";
import { IStockReportData } from "../pages/stock-report";
const URL = "http://127.0.0.1:3000";
export class CustomerProductService {
  async getCustomerProduct(
    query?: {
      endDate: Date;
    },
    config?: AxiosRequestConfig
  ) {
    const token = Cookies.get("auth_token");
    // Create filtered query object
    const queryParams: Record<string, string> = {};
    if (query?.endDate) {
      queryParams.end_date = query.endDate.toISOString();
    }

    const response = await axios.get<IStockReportData[]>(
      `${URL}/api/v1/report/stock-report`,
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
