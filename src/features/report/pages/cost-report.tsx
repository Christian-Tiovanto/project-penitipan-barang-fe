import { useState } from "react";
import {
  EndDatePicker,
  StartDatePicker,
} from "../../../components/date-picker";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import {
  EnhancedTableProps,
  HeadCell,
} from "../../../components/table-component";
import { startOfToday, startOfTomorrow } from "date-fns";
import { Order } from "../../../enum/SortOrder";
import React from "react";
import { useCostReport } from "../hooks/cost-report.hooks";

export interface ICostReportData {
  initial_balance: number;
  cashflows: {
    date: Date;
    type: "in" | "out";
    amount: number;
  }[];
  final_balance: number;
}
type TableData = ICostReportData & {
  row_no: number;
  date: Date;
  type: "in" | "out";
  amount: number;
};
const columns: HeadCell<TableData>[] = [
  {
    field: "row_no",
    headerName: "No",
    headerStyle: {
      width: "1%",
    },
  },
  {
    field: "date",
    headerName: "Date",
    headerStyle: {
      width: "10%",
    },
  },
  {
    field: "type",
    headerName: "Type",
    headerStyle: {
      width: "10%",
    },
  },
  {
    field: "amount",
    headerName: "Amount",
    headerStyle: {
      width: "10%",
    },
  },
  {
    field: "final_balance",
    headerName: "Final Balance",
    headerStyle: {
      width: "10%",
      textAlign: "center",
    },
  },
];
// Add this utility function to calculate running totals
const calculateRunningTotals = (
  cashflows: ICostReportData["cashflows"],
  initialQty: number
) => {
  let runningTotal = initialQty;
  return cashflows.map((transaction) => {
    runningTotal +=
      transaction.type === "in" ? transaction.amount : -transaction.amount;
    return {
      ...transaction,
      final_qty: runningTotal,
    };
  });
};

function EnhancedTableHead(props: EnhancedTableProps<TableData>) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof TableData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          className="fw-bold text-nowrap"
          sx={{
            width: "1%",
            fontWeight: "bold",
          }}
        >
          No
        </TableCell>

        {columns.slice(1, 4).map((col) => (
          <TableCell
            className="fw-bold text-nowrap"
            key={col.field}
            sortDirection={orderBy === col.field ? order : false}
            sx={{
              width: col.headerStyle?.width,
              minWidth: col.headerStyle?.minWidth,
              textAlign: col.headerStyle?.textAlign,
              fontWeight: "bold",
            }}
          >
            <TableSortLabel
              active={orderBy === col.field}
              direction={orderBy === col.field ? order : "asc"}
              onClick={createSortHandler(col.field)}
            >
              {col.headerName}
              {orderBy === col.field ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {columns.slice(4).map((col) => (
          <TableCell
            className="fw-bold text-nowrap"
            key={col.field}
            sortDirection={orderBy === col.field ? order : false}
            sx={{
              width: col.headerStyle?.width,
              minWidth: col.headerStyle?.minWidth,
              textAlign: col.headerStyle?.textAlign,
              fontWeight: "bold",
            }}
          >
            {col.headerName}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function CostReportPage() {
  const [startDate, setStartDate] = useState(startOfToday());
  const [endDate, setEndDate] = useState(startOfTomorrow());
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof TableData>("date");

  const { data, isLoading } = useCostReport({
    startDate,
    endDate,
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedTransactions = React.useMemo(() => {
    if (!data) return [];
    const transactionsCopy = [...data.cashflows];

    // Sort transactions
    const sorted = transactionsCopy.sort((a, b) => {
      if (orderBy === "date") {
        return order === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (orderBy === "type") {
        return order === "asc"
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
      if (orderBy === "amount") {
        return order === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });

    return calculateRunningTotals(sorted, data.initial_balance);
  }, [data, order, orderBy]);

  // Calculate summary values
  const summary = React.useMemo(() => {
    if (!data) return null;

    const totalIn = data.cashflows
      .filter((t) => t.type === "in")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOut = data.cashflows
      .filter((t) => t.type === "out")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      initial: data.initial_balance,
      totalIn,
      totalOut,
      final: data.final_balance,
    };
  }, [data]);

  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-md-6 position-relative mb-2">
            <StartDatePicker
              idDatePicker="tanggal-awal"
              titleText="Tanggal Awal"
              datetime={false}
              value={startDate}
              onDateClick={(date: Date) => {
                setStartDate(date);
              }}
            />
          </div>
          <div className="col-md-6 position-relative mb-2">
            <EndDatePicker
              idDatePicker="tanggal-akhir"
              titleText="Tanggal Akhir"
              datetime={false}
              value={endDate}
              onDateClick={(date: Date) => {
                setEndDate(date);
              }}
            />
          </div>
        </div>
        <div className="container-fluid d-flex my-4 flex-wrap justify-content-center gap-2">
          <div
            className="badge rounded-pill text-black p-2 px-4 fw-normal blue-lighten"
            style={{
              fontSize: "13px",
              maxHeight: "37.5px",
            }}
          >
            Initial Balance :{" "}
            {summary?.initial
              ? Number(summary.initial).toLocaleString("id-ID")
              : 0}
          </div>
          <div
            className="badge rounded-pill text-black p-2 px-4 fw-normal green-lighten"
            style={{
              fontSize: "13px",
              maxHeight: "37.5px",
            }}
          >
            Total In :{" "}
            {summary?.totalIn
              ? Number(summary.totalIn).toLocaleString("id-ID")
              : 0}
          </div>
          <div
            className="badge rounded-pill text-black p-2 px-4 red-lighten fw-normal"
            style={{
              fontSize: "13px",
              maxHeight: "37.5px",
            }}
          >
            Total Out :{" "}
            {summary?.totalOut
              ? Number(summary.totalOut).toLocaleString("id-ID")
              : 0}
          </div>
          <div
            className="badge rounded-pill teal-lighten text-black p-2 px-4 fw-normal"
            style={{
              fontSize: "13px",
              maxHeight: "37.5px",
            }}
          >
            Final Balance :{" "}
            {summary?.final ? Number(summary.final).toLocaleString("id-ID") : 0}
          </div>
        </div>
        <div className="product-in-list w-100 d-flex flex-column">
          <div className="mui-table-container">
            <TableContainer component={Paper} sx={{ padding: 2 }}>
              <Table>
                <EnhancedTableHead
                  onRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                />
                <TableBody>
                  {!isLoading && data ? (
                    <>
                      {/* Initial Stock Row */}
                      <TableRow className="blue-lighten">
                        <TableCell>1</TableCell>
                        <TableCell>
                          {new Date().toLocaleString("en-GB")}
                        </TableCell>
                        <TableCell>INITIAL BALANCE</TableCell>
                        <TableCell className="text-start">
                          {Number(data.initial_balance).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-center">
                          {Number(data.initial_balance).toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>

                      {/* Transaction Rows */}
                      {sortedTransactions.map((transaction, index) => (
                        <TableRow
                          key={index}
                          className={`${
                            transaction.type === "in"
                              ? "green-lighten"
                              : "red-lighten"
                          }`}
                        >
                          <TableCell>{index + 2}</TableCell>
                          <TableCell>
                            {new Date(transaction.date).toLocaleString("en-GB")}
                          </TableCell>
                          <TableCell>
                            {`${transaction.type === "in" ? "In" : "Out"}`}
                          </TableCell>
                          <TableCell className="text-start">
                            {`${transaction.type === "in" ? "+" : "-"} ${Number(
                              transaction.amount
                            ).toLocaleString("id-ID")}`}
                          </TableCell>
                          <TableCell className="text-center">
                            {Number(transaction.final_qty).toLocaleString(
                              "id-ID"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Final Stock Row */}
                      <TableRow className="blue-lighten">
                        <TableCell>{sortedTransactions.length + 2}</TableCell>
                        <TableCell>
                          {new Date().toLocaleString("en-GB")}
                        </TableCell>
                        <TableCell>FINAL BALANCE</TableCell>
                        <TableCell className="text-start">
                          {Number(data.final_balance).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-center">
                          {Number(data.final_balance).toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="w-100 d-flex justify-content-center">
                          <div
                            className="spinner-border d-flex justify-content-center"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}
