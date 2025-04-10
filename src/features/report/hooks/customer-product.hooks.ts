import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContexts";
import { CustomerProductService } from "../services/customer-product.service";
import { IStockReportData } from "../pages/stock-report";

export const useCustomerProductReport = (query: { endDate: Date }) => {
  const { endDate } = query;
  const [data, setData] = useState<IStockReportData[]>([]);
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
        const customerProductReport =
          await new CustomerProductService().getCustomerProduct(
            {
              endDate,
            },
            { signal: controller.signal }
          );
        setData(customerProductReport);
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
  }, [endDate]);

  return {
    data,
    isLoading,
    error,
  };
};
