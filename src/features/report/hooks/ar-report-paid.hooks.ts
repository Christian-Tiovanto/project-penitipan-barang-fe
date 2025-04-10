import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContexts";
import { Order } from "../../../enum/SortOrder";
import { StockBookReportService } from "../services/stock-book.service";
import { ArPaidReportService } from "../services/ar-report-paid.service";
import { IArReportPaidData } from "../pages/ar-report-paid";
export const useArPaidReport = (query: {
  customerId: string;
  startDate: Date;
  endDate: Date;
  pageNo: number;
  pageSize: number;
  sortBy: string;
  order: Order;
}) => {
  const { startDate, endDate, customerId, pageNo, pageSize, sortBy, order } =
    query;
  const [data, setData] = useState<IArReportPaidData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null | any>(null);
  const { showToast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setIsLoading(true);
        setError(null);
        const arPaidReport = await new ArPaidReportService().getArPaidReport(
          { endDate, startDate, customerId, pageNo, pageSize, sortBy, order },
          { signal: controller.signal }
        );
        setData(arPaidReport);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err);
          const finalMessage = `Failed to get data.\n${
            (err as any)?.response?.data?.message ||
            (err as Error)?.message ||
            "Unknown error"
          }`;
          showToast(finalMessage, "danger");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [customerId, startDate, endDate, pageNo, pageSize, order, sortBy]);

  return {
    data,
    isLoading,
    error,
  };
};
