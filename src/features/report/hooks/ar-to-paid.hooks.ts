import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContexts";
import { Order } from "../../../enum/SortOrder";
import { StockBookReportService } from "../services/stock-book.service";
import { ArPaidReportService } from "../services/ar-report-paid.service";
import { IArReportPaidData } from "../pages/ar-report-paid";
import { ArToPaidService } from "../services/ar-to-paid.service";
import { IArToPaidData } from "../ar-to-paid";
export const useArToPaidReport = (query: {
  customerId: string;
  startDate: Date;
  endDate: Date;
  sortBy: string;
  order: Order;
}) => {
  const { startDate, endDate, customerId, sortBy, order } = query;
  const [data, setData] = useState<IArToPaidData[]>([]);
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
        const arPaidReport = await new ArToPaidService().getArToPaidReport(
          { endDate, startDate, customerId, sortBy, order },
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
  }, [customerId, startDate, endDate, order, sortBy]);

  return {
    data,
    isLoading,
    error,
  };
};
