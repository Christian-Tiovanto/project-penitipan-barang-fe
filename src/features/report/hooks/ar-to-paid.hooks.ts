import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContexts";
import { Order } from "../../../enum/SortOrder";
import { ArToPaidService } from "../services/ar-to-paid.service";
import { IArToPaidData } from "../pages/ar-to-paid";
import { PaginationMetaData } from "../../../interfaces/pagination-meta";
export const useArToPaidReport = (query: {
  customerId: string;
  startDate: Date;
  endDate: Date;
  sortBy: string;
  order: Order;
  pageNo: number;
  pageSize: number;
}) => {
  const { startDate, endDate, customerId, sortBy, order, pageNo, pageSize } =
    query;
  const [response, setData] = useState<PaginationMetaData<IArToPaidData>>({
    meta: {
      total_count: 0,
      total_page: 0,
      page_no: 0,
      page_size: 0,
    },
    data: [],
  });
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
          { endDate, startDate, customerId, sortBy, order, pageNo, pageSize },
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
  }, [customerId, startDate, endDate, order, sortBy, pageNo, pageSize]);

  return {
    response,
    isLoading,
    error,
  };
};
