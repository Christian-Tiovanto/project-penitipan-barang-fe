import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { IStockReportData } from "../pages/stock-report";
import { IStockInvoiceReportData } from "../pages/stock-invoice-report";
const URL = "http://127.0.0.1:3000";
export class StockInvoiceReportService {
  async getStockInvoiceReport(
    query?: {
      //   endDate: Date;
      invoice: string;
    },
    config?: AxiosRequestConfig
  ) {
    const token = Cookies.get("auth_token");
    // Create filtered query object
    const queryParams: Record<string, string> = {};

    // if (query?.endDate) {
    //   queryParams.end_date = query.endDate.toISOString();
    // }
    if (query?.invoice) {
      queryParams.invoice = query.invoice;
    }
    // Build URL with filtered parameters
    const response = await axios.get<IStockInvoiceReportData[]>(
      `${URL}/api/v1/report/stock-invoice-report`,
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

  async getAllInvoices() {
    try {
      const token = Cookies.get("auth_token");

      const response = await axios.get(`${URL}/api/v1/invoice/all`, {
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
