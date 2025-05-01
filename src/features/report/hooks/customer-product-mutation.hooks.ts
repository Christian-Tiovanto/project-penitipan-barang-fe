import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContexts";
import { ICustomerProductMutation } from "../pages/customer-product-mutation";
import { CustomerProductMutationService } from "../services/customer-product-mutation.service";

export const useCustomerProductMutation = (
  customerId: string,
  query: {
    startDate: Date;
    endDate: Date;
  }
) => {
  const { startDate, endDate } = query;
  const [response, setData] = useState<ICustomerProductMutation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null | any>(null);
  const { showToast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!customerId) {
      setData([]); // Clear previous data
      return;
    }

    const fetchData = async () => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      try {
        setIsLoading(true);
        setError(null);
        const customerProductMutation =
          await new CustomerProductMutationService().getCustomerProductMutation(
            customerId,
            {
              endDate,
              startDate,
            },
            { signal: controller.signal }
          );
        setData(customerProductMutation);
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
  }, [startDate, endDate, customerId]);

  return {
    response,
    isLoading,
    error,
  };
};
