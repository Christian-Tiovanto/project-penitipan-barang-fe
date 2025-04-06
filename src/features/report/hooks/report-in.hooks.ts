import { useEffect, useRef, useState } from "react";
import { TransactionInReportService } from "../services/report-in.service";

export const useTransactionInReport = (query: {
  startDate: Date;
  endDate: Date;
  pageNo: number;
  pageSize: number;
}) => {
  const { startDate, endDate, pageNo, pageSize } = query;
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
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
            },
            { signal: controller.signal }
          );
        setData(transactionInReport);
      } catch (err) {
        setData([]);
        if (!controller.signal.aborted) {
          setError(err as Error);
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
  }, [startDate, endDate, pageNo, pageSize]);

  return {
    data,
    isLoading,
    error,
  };
};
