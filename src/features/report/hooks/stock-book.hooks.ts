import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContexts";
import { Order } from "../../../enum/SortOrder";
import { StockBookReportService } from "../services/stock-book.service";
import { IStockBookData } from "../pages/stock-book";
export const useStockBookReport = (
  productId: string,
  customerId: string,
  query: {
    startDate: Date;
    endDate: Date;
  }
) => {
  const { startDate, endDate } = query;
  const [data, setData] = useState<IStockBookData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null | any>(null);
  const { showToast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);
  useEffect(() => {
    // Only fetch if both IDs exist
    if (!productId || !customerId) {
      setData(undefined); // Clear previous data
      return;
    }

    const fetchData = async () => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setIsLoading(true);
        setError(null);
        const stockBookReport =
          await new StockBookReportService().getStockBookReport(
            productId,
            customerId,
            { endDate, startDate },
            { signal: controller.signal }
          );

        setData(stockBookReport);
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
  }, [productId, customerId, startDate, endDate]);

  return {
    data,
    isLoading,
    error,
  };
};
