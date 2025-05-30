import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { INettIncomeReport } from "../pages/nett-income-report";
const URL = import.meta.env.VITE_API_URL;
export class NettIncomeService {
  async getNettIncome(
    query?: {
      startDate: Date;
      endDate: Date;
    },
    config?: AxiosRequestConfig
  ) {
    const token = Cookies.get("auth_token");
    // Create filtered query object
    const queryParams: Record<string, string> = {};
    if (query?.startDate) {
      queryParams.start_date = query.startDate.toISOString();
    }
    if (query?.endDate) {
      queryParams.end_date = query.endDate.toISOString();
    }
    // Build URL with filtered parameters
    const response = await axios.get<INettIncomeReport>(
      `${URL}/api/v1/report/nett-income-report`,
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
