import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContexts";
import { Order } from "../../../enum/SortOrder";
import { NettIncomeService } from "../services/nett-income.service";
import { INettIncomeReport } from "../pages/nett-income-report";

export const useNettIncome = (query: { startDate: Date; endDate: Date }) => {
  const { startDate, endDate } = query;
  const [data, setData] = useState<INettIncomeReport>();
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
        const transactionInReport = await new NettIncomeService().getNettIncome(
          {
            endDate,
            startDate,
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
  }, [startDate, endDate]);

  return {
    data,
    isLoading,
    error,
  };
};
