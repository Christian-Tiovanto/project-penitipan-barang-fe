import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { ICostReportData } from "../pages/cost-report";
const URL = "http://127.0.0.1:3000";
export class CostReportService {
  async getCostReport(
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
    const response = await axios.get<ICostReportData>(
      `${URL}/api/v1/report/cashflow-report`,
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
