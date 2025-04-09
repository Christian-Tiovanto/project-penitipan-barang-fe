import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { Order } from "../../../enum/SortOrder";
import { IArReportPaidData } from "../pages/ar-report-paid";
import { IArToPaidData } from "../pages/ar-to-paid";
import { AR } from "../pages/ar-list";
const URL = "http://127.0.0.1:3000";

export interface BulkArPaymentDetailDto {
  arId: number;
  total_paid: number;
}
export interface CreateBulkArPaymentDto {
  payment_methodId: string;
  transfer_date: Date;
  data: BulkArPaymentDetailDto[];
  reference_no: string;
}
export class ArToPaidService {
  async getArToPaidReport(
    query?: {
      startDate: Date;
      endDate: Date;
      sortBy: string;
      order: Order;
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
    if (query?.sortBy) {
      queryParams.sort = query?.sortBy;
    }
    if (query?.order) {
      queryParams.order = query?.order;
    }
    queryParams.compact = "true";
    // Build URL with filtered parameters
    const response = await axios.get<{ data: IArToPaidData[] }>(
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
    return response.data.data;
  }

  async createBulkArPayment(
    listAr: AR[],
    paymentMethodId: string,
    reference_no: string
  ) {
    const token = Cookies.get("auth_token");

    const createBulkArPaymentDto: CreateBulkArPaymentDto = {
      payment_methodId: paymentMethodId,
      transfer_date: new Date(),
      data: listAr.map((ar) => ({ arId: ar.id, total_paid: ar.to_paid })),
      reference_no: "123",
    };
    const response = await axios.post(
      `${URL}/api/v1/ar-payment/bulk`,
      createBulkArPaymentDto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  }
}
