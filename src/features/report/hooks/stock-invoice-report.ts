import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContexts";
import { IStockInvoiceReportData } from "../pages/stock-invoice-report";
import { StockInvoiceReportService } from "../services/stock-invoice-report.service";
// import { StockInvoiceReportService } from "../services/stock-invoice-report.service";
// import { IStockReportData } from "../pages/stock-report";

export const useStockInvoiceReport = (query: { invoice: string }) => {
  const { invoice } = query;
  const [data, setData] = useState<IStockInvoiceReportData[]>([]);
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
        const stockInvoiceReportData =
          await new StockInvoiceReportService().getStockInvoiceReport(
            {
              invoice,
            },
            { signal: controller.signal }
          );
        setData(stockInvoiceReportData);
      } catch (err) {
        setData([]);
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
  }, [invoice]);

  return {
    data,
    isLoading,
    error,
  };
};
