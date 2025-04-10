import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContexts";
import { Order } from "../../../enum/SortOrder";
import { ArStatus } from "../../../enum/ArStatus";
import { InvoiceListService } from "../services/invoice-list.service";
import { Invoice } from "../pages/invoice-list";
export const useInvoiceList = (query: {
  customerId: string;
  status: ArStatus;
  startDate: Date;
  endDate: Date;
  pageNo: number;
  pageSize: number;
  sortBy: string;
  order: Order;
}) => {
  const {
    startDate,
    endDate,
    customerId,
    pageNo,
    pageSize,
    sortBy,
    order,
    status,
  } = query;
  const [response, setData] = useState<{
    meta: {
      total_count: number;
      total_page: number;
      page_no: number;
      page_size: number;
    };
    data: Invoice[];
  }>({
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
        const arPaidReport = await new InvoiceListService().getInvoiceList(
          {
            endDate,
            startDate,
            customerId,
            pageNo,
            pageSize,
            sortBy,
            order,
            invoiceStatus: status,
          },
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
  }, [customerId, startDate, endDate, pageNo, pageSize, order, sortBy, status]);

  return {
    response,
    isLoading,
    error,
  };
};
