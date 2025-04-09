import axios, { AxiosRequestConfig } from "axios";
import { ITransactionInData } from "../pages/report-in";
import Cookies from "js-cookie";
import { Order } from "../../../enum/SortOrder";
import { PaginationMetaData } from "../../../interfaces/pagination-meta";
import { ITransactionOutData } from "../pages/report-out";
const URL = "http://127.0.0.1:3000";
export class TransactionOutReportService {
  async getTransactionOuts(
    query?: {
      startDate: Date;
      endDate: Date;
      pageSize: number;
      pageNo: number;
      sortBy: string;
      order: Order;
    },
    config?: AxiosRequestConfig
  ) {
    const token = Cookies.get("auth_token");
    // Create filtered query object
    const queryParams: Record<string, string> = {};
    if (query?.sortBy) {
      queryParams.sort = query?.sortBy;
    }
    if (query?.order) {
      queryParams.order = query?.order;
    }
    // Conditional parameter formatting
    if (query?.startDate) {
      queryParams.start_date = query.startDate.toISOString();
    }
    if (query?.endDate) {
      queryParams.end_date = query.endDate.toISOString();
    }
    if (query?.pageSize) {
      queryParams.page_size = query.pageSize.toString();
    }
    if (query?.pageNo !== undefined) {
      queryParams.page_no = query.pageNo.toString();
    }

    const response = await axios.get<PaginationMetaData<ITransactionOutData>>(
      `${URL}/api/v1/transaction-out`,
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
