import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContexts";
import { AgingReportService } from "../services/aging-report.service";
import { IAgingReportData } from "../pages/aging-report";
// import { StockInvoiceReportService } from "../services/stock-invoice-report.service";
// import { IStockReportData } from "../pages/stock-report";

export const useAgingReport = (query: { customer: string }) => {
  const { customer } = query;
  const [data, setData] = useState<IAgingReportData[]>([]);
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
        const agingReportData = await new AgingReportService().getAgingReport(
          {
            customer,
          },
          { signal: controller.signal }
        );
        setData(agingReportData);
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
  }, [customer]);

  return {
    data,
    isLoading,
    error,
  };
};
