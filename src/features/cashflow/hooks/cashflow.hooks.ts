import { useEffect, useRef, useState } from "react";
import { CashflowService } from "../services/cashflow.service";
import { useToast } from "../../../contexts/toastContexts";
import { Order } from "../../../enum/SortOrder";

export const useCashflowHistory = (query: {
  startDate: Date;
  endDate: Date;
  pageNo?: number;
  pageSize?: number;
}) => {
  const { startDate, endDate, pageNo, pageSize } = query;
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
        const cashflowHistory = await new CashflowService().getCashflowHistory(
          {
            endDate,
            startDate,
            pageNo,
            pageSize,
          },
          { signal: controller.signal }
        );
        setData(cashflowHistory);
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
  }, [startDate, endDate]);

  return {
    data,
    isLoading,
    error,
  };
};
