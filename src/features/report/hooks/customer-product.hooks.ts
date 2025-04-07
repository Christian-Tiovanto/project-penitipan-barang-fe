import { useEffect, useRef, useState } from "react";
import { TransactionInReportService } from "../services/report-in.service";
import { useToast } from "../../../contexts/toastContexts";
import { Order } from "../../../enum/SortOrder";

export const useTransactionInReport = (query: {
  startDate: Date;
  endDate: Date;
  pageNo: number;
  pageSize: number;
  sortBy: string;
  order: Order;
}) => {
  const { startDate, endDate, pageNo, pageSize, order, sortBy } = query;
  const [data, setData] = useState<any[]>([]);
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
        const transactionInReport =
          await new TransactionInReportService().getTransactionIns(
            {
              endDate,
              startDate,
              pageNo,
              pageSize,
              sortBy,
              order,
            },
            { signal: controller.signal }
          );
        setData(transactionInReport);
      } catch (err) {
        setData([]);
        if (!controller.signal.aborted) {
          setError(err as Error);
        }
        if (error) {
          const finalMessage = `Failed to get data.\n${
            error?.response?.data?.message || error?.message || "Unknown error"
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
  }, [startDate, endDate, pageNo, pageSize, order, sortBy]);

  return {
    data,
    isLoading,
    error,
  };
};
