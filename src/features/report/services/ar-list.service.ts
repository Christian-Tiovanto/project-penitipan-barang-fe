import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { Order } from "../../../enum/SortOrder";
import { ArStatus } from "../../../enum/ArStatus";
import { AR } from "../pages/ar-list";
import { PaginationMetaData } from "../../../interfaces/pagination-meta";
const URL = import.meta.env.VITE_API_URL;
export class ArListService {
  async getArList(
    query?: {
      startDate: Date;
      endDate: Date;
      pageSize: number;
      pageNo: number;
      sortBy: string;
      order: Order;
      arStatus: ArStatus;
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
    if (query?.arStatus) {
      queryParams.status = query?.arStatus;
    }
    queryParams.compact = "true";
    queryParams.with_payment = "true";
    // Build URL with filtered parameters
    const response = await axios.get<PaginationMetaData<AR>>(
      `${URL}/api/v1/report/ar-paid-report`,
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
