import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

export const createTransOut = async (
  customerId: number,
  noPlat: string,
  clockOut: string, // ISO date string
  transactionOuts: {
    productId: number;
    converted_qty: number;
  }[],
  transInHeaderId: number
) => {
  try {
    const token = Cookies.get("auth_token");
    const response = await axios.post(
      `${API_URL}/api/v1/transaction-out`,
      {
        customerId,
        no_plat: noPlat,
        clock_out: clockOut,
        transaction_outs: transactionOuts,
        transaction_in_headerId: transInHeaderId,
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
    converted_qty: number;
  }[]
) => {
  try {
    const token = Cookies.get("auth_token");
    const response = await axios.post(
      `${API_URL}/api/v1/transaction-out/fifo`,
      {
        customerId,
        no_plat: noPlat,
        clock_out: clockOut,
        transaction_outs: transactionOuts,
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
    converted_qty: number;
  }[],
  transInHeaderId: number
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
        transaction_in_headerId: transInHeaderId,
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
    converted_qty: number;
  }[]
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
