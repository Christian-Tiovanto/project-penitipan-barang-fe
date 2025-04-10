import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { Order } from "../../../enum/SortOrder";
import { ArStatus } from "../../../enum/ArStatus";
import { PaginationMetaData } from "../../../interfaces/pagination-meta";
import { Invoice } from "../pages/invoice-list";
const URL = "http://127.0.0.1:3000";
export class InvoiceListService {
  async getInvoiceList(
    query?: {
      startDate: Date;
      endDate: Date;
      pageSize: number;
      pageNo: number;
      sortBy: string;
      order: Order;
      invoiceStatus: ArStatus;
      customerId: string;
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
    if (query?.customerId) {
      queryParams.customer = query.customerId;
    }
    if (query?.pageSize) {
      queryParams.page_size = query.pageSize.toString();
    }
    if (query?.pageNo !== undefined) {
      queryParams.page_no = query.pageNo.toString();
    }
    if (query?.sortBy) {
      queryParams.sort = query?.sortBy;
    }
    if (query?.order) {
      queryParams.order = query?.order;
    }
    if (query?.invoiceStatus) {
      queryParams.status = query?.invoiceStatus;
    }
    // Build URL with filtered parameters
    const response = await axios.get<PaginationMetaData<Invoice>>(
      `${URL}/api/v1/invoice`,
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

  async getSpb(invoiceId: number, config?: AxiosRequestConfig) {
    const token = Cookies.get("auth_token");

    const queryParams: Record<string, string> = {};
    const response = await axios.get(
      `${URL}/api/v1/spb/by-invoice/${invoiceId}`,
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

  async getTransOut(invoiceId: number, config?: AxiosRequestConfig) {
    const token = Cookies.get("auth_token");

    const queryParams: Record<string, string> = {};
    const response = await axios.get(
      `${URL}/api/v1/transaction-out/by-invoice/${invoiceId}`,
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
