import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { IStockReportData } from "../pages/stock-report";
import { IStockInvoiceReportData } from "../pages/stock-invoice-report";
import { IAgingReportData } from "../pages/aging-report";
const URL = import.meta.env.VITE_API_URL;
export class AgingReportService {
  async getAgingReport(
    query?: {
      //   endDate: Date;
      customer: string;
    },
    config?: AxiosRequestConfig
  ) {
    const token = Cookies.get("auth_token");
    // Create filtered query object
    const queryParams: Record<string, string> = {};

    // if (query?.endDate) {
    //   queryParams.end_date = query.endDate.toISOString();
    // }
    if (query?.customer) {
      queryParams.customer = query.customer;
    }
    // Build URL with filtered parameters
    const response = await axios.get<IAgingReportData[]>(
      `${URL}/api/v1/report/aging-report`,
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

  async getAllCustomers() {
    try {
      const token = Cookies.get("auth_token");

      const response = await axios.get(`${URL}/api/v1/customer/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || "get all Invoices failed";
    }
  }
}
