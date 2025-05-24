import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

export const createTransOut = async (
  customerId: number,
  noPlat: string,
  clockOut: string, // ISO date string
  transactionOuts: {
    productId: number;
    qty: number;
    productName: string;
  }[],
  transactionOutsBrgLuar: {
    productId: number;
    qty: number;
    productName: string;
    price: number;
    total_price: number;
    converted_qty: number;
  }[],
  transInHeaderId: number,
  transaction_date: string
  // spbDesc: string
) => {
  try {
    const token = Cookies.get("auth_token");
    const response = await axios.post(
      `${API_URL}/api/v1/transaction-out`,
      {
        customerId,
        no_plat: noPlat,
        clock_out: clockOut,
        // desc: spbDesc,
        transaction_outs: transactionOuts,
        transaction_outs_brg_luar: transactionOutsBrgLuar,
        transaction_in_headerId: transInHeaderId,
        transaction_date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Transaction Out failed";
  }
};

export const createTransOutFifo = async (
  customerId: number,
  noPlat: string,
  clockOut: string, // ISO date string
  transactionOuts: {
    productId: number;
    qty: number;
  }[],
  transactionOutsBrgLuar: {
    productId: number;
    qty: number;
    productName: string;
    price: number;
    total_price: number;
    converted_qty: number;
  }[],
  transaction_date: string
  // spbDesc: string
) => {
  try {
    const token = Cookies.get("auth_token");
    const response = await axios.post(
      `${API_URL}/api/v1/transaction-out/fifo`,
      {
        customerId,
        no_plat: noPlat,
        clock_out: clockOut,
        // desc: spbDesc,
        transaction_outs: transactionOuts,
        transaction_outs_brg_luar: transactionOutsBrgLuar,
        transaction_date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Transaction Out Fifo failed";
  }
};

export const previewTransOut = async (
  customerId: number,
  noPlat: string,
  clockOut: string, // ISO date string
  transactionOuts: {
    productId: number;
    qty: number;
  }[],
  transactionOutsBrgLuar: {
    productId: number;
    qty: number;
    productName: string;
    price: number;
    total_price: number;
    converted_qty: number;
  }[],
  transInHeaderId: number,
  transaction_date: string
) => {
  try {
    const token = Cookies.get("auth_token");
    const response = await axios.post(
      `${API_URL}/api/v1/transaction-out/preview`,
      {
        customerId,
        no_plat: noPlat,
        clock_out: clockOut,
        transaction_outs: transactionOuts,
        transaction_outs_brg_luar: transactionOutsBrgLuar,
        transaction_in_headerId: transInHeaderId,
        transaction_date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Preview Transaction Out failed";
  }
};

export const previewTransOutFifo = async (
  customerId: number,
  noPlat: string,
  clockOut: string, // ISO date string
  transactionOuts: {
    productId: number;
    qty: number;
  }[],
  transactionOutsBrgLuar: {
    productId: number;
    qty: number;
    productName: string;
    price: number;
    total_price: number;
    converted_qty: number;
  }[],
  transaction_date: string
) => {
  try {
    const token = Cookies.get("auth_token");
    const response = await axios.post(
      `${API_URL}/api/v1/transaction-out/preview/fifo`,
      {
        customerId,
        no_plat: noPlat,
        clock_out: clockOut,
        transaction_outs: transactionOuts,
        transaction_outs_brg_luar: transactionOutsBrgLuar,
        transaction_date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Preview Transaction Out Fifo failed";
  }
};
