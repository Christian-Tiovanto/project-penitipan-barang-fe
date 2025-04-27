import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContexts";
import { Order } from "../../../enum/SortOrder";
import { TransactionOutReportService } from "../services/report-out.service";
import { PaginationMetaData } from "../../../interfaces/pagination-meta";
import { ITransactionOutData } from "../pages/report-out";

export const useTransactionOutReport = (query: {
  startDate: Date;
  endDate: Date;
  pageNo: number;
  pageSize: number;
  sortBy: string;
  order: Order;
}) => {
  const { startDate, endDate, pageNo, pageSize, order, sortBy } = query;
  const [response, setData] = useState<PaginationMetaData<ITransactionOutData>>(
    {
      meta: {
        total_count: 0,
        total_page: 0,
        page_no: 0,
        page_size: 0,
      },
      data: [],
    }
  );
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
          await new TransactionOutReportService().getTransactionOuts(
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
        if (!controller.signal.aborted) {
          setError(err as Error);
          const finalMessage = `Failed to get data.\n${
            err?.response?.data?.message || err?.message || "Unknown error"
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
    response,
    isLoading,
    error,
  };
};
