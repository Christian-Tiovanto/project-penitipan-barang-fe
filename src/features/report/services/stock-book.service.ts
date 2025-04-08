import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { IStockBookData } from "../pages/stock-book";
const URL = "http://127.0.0.1:3000";
export class StockBookReportService {
  async getStockBookReport(
    productId: string,
    customerId: string,
    query?: {
      startDate: Date;
      endDate: Date;
    },
    config?: AxiosRequestConfig
  ) {
    const token = Cookies.get("auth_token");
    // Create filtered query object
    const queryParams: Record<string, string> = {};
    // Conditional parameter formatting
    if (query?.startDate) {
      queryParams.start_date = query.startDate.toISOString();
    }
    if (query?.endDate) {
      queryParams.end_date = query.endDate.toISOString();
    }
    console.log(query);
    // Build URL with filtered parameters
    const response = await axios.get<{ data: IStockBookData }>(
      `${URL}/api/v1/report/stock-book/product/${productId}/customer/${customerId}`,
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
