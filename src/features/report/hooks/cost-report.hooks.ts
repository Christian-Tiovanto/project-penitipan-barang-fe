import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContexts";
import { CostReportService } from "../services/cost-report.service";
import { ICostReportData } from "../pages/cost-report";
export const useCostReport = (query: { startDate: Date; endDate: Date }) => {
  const { startDate, endDate } = query;
  const [data, setData] = useState<ICostReportData>();
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
        const stockBookReport = await new CostReportService().getCostReport(
          { endDate, startDate },
          { signal: controller.signal }
        );

        setData(stockBookReport);
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
  }, [startDate, endDate]);

  return {
    data,
    isLoading,
    error,
  };
};
