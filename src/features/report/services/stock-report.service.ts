import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { IStockReportData } from "../pages/stock-report";
const URL = "http://127.0.0.1:3000";
export class StockReportService {
  async getStockReport(
    query?: {
      endDate: Date;
      customer: string;
    },
    config?: AxiosRequestConfig
  ) {
    const token = Cookies.get("auth_token");
    // Create filtered query object
    const queryParams: Record<string, string> = {};

    if (query?.endDate) {
      queryParams.end_date = query.endDate.toISOString();
    }
    if (query?.customer) {
      queryParams.customer = query.customer;
    }
    // Build URL with filtered parameters
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
