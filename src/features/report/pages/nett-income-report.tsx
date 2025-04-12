import { useState } from "react";
import {
  EndDatePicker,
  StartDatePicker,
} from "../../../components/date-picker";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { ColumnConfig } from "../../../components/table-component";
import { startOfToday, startOfTomorrow } from "date-fns";
import { useNettIncome } from "../hooks/nett-income.hooks";
import PageLayout from "../../../components/page-location";
export interface INettIncomeReport {
  earning: {
    input: number;
    payment: number;
  };
  spending: {
    description: string;
    amount: number;
  }[];
}
export function NettIncomeReportPage() {
  const [startDate, setStartDate] = useState(startOfToday());
  const [endDate, setEndDate] = useState(startOfTomorrow());

  const { data, isLoading } = useNettIncome({
    startDate,
    endDate,
  });

  const columns: ColumnConfig<{ description: string; total: string }>[] = [
    {
      field: "description",
      headerName: "Description",
      headerStyle: {
        width: "70%",
      },
    },
    {
      field: "total",
      headerName: "Total",
      headerStyle: {
        width: "30%",
      },
    },
  ];

  return (
    <>
      <PageLayout title="Report" items={["Nett Income"]}>
        <div className="container-fluid m-0 p-0">
          <div className="row">
            <div className="col-md-6 position-relative">
              <StartDatePicker
                idDatePicker="tanggal-awal-nett-income"
                titleText="Start Date"
                datetime={false}
                value={startDate}
                onDateClick={(date: Date) => {
                  setStartDate(date);
                }}
              />
            </div>
            <div className="col-md-6 position-relative">
              <EndDatePicker
                idDatePicker="tanggal-akhir-nett-income"
                titleText="End Date"
                datetime={false}
                value={endDate}
                onDateClick={(date: Date) => {
                  setEndDate(date);
                }}
              />
            </div>
          </div>
          <div className="product-in-list w-100 d-flex flex-column align-items-center">
            <div className="mui-table-container w-75">
              <TableContainer component={Paper} sx={{ padding: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow className="gray">
                      {columns.map((col) => (
                        <TableCell
                          className="border border-black text-center"
                          key={col.field}
                          sx={{
                            width: col.headerStyle?.width,
                            minWidth: col.headerStyle?.minWidth,
                            textAlign: col.headerStyle?.textAlign,
                            textWrap: col.headerStyle?.textWrap,
                            fontWeight: "bold",
                          }}
                        >
                          <b>{col.headerName}</b>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data && !isLoading ? (
                      <>
                        <TableRow>
                          <TableCell className="nett-income-table-border fw-bold text-decoration-underline p-0 ps-2">
                            Earning
                          </TableCell>
                          <TableCell className="nett-income-table-border p-0"></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="nett-income-table-border p-0 ps-4">
                            Total Invoice
                          </TableCell>
                          <TableCell className="nett-income-table-border p-0 text-end pe-2">
                            {Number(data?.earning.payment).toLocaleString(
                              "id-ID"
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="nett-income-table-border p-0 ps-4">
                            Total Input Cashflow
                          </TableCell>
                          <TableCell className="nett-income-table-border p-0 text-end pe-2">
                            {Number(data?.earning.input).toLocaleString(
                              "id-ID"
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="gray">
                          <TableCell className="border border-top-0 border-black fw-bold p-0 pe-2 text-end">
                            Total Earning
                          </TableCell>
                          <TableCell className="border border-top-0 border-black fw-bold p-0 pe-2 text-end">
                            {Number(
                              data?.earning.input + data?.earning.payment
                            ).toLocaleString("id-ID")}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="nett-income-table-border fw-bold text-decoration-underline p-0 ps-2">
                            Cost
                          </TableCell>
                          <TableCell className="nett-income-table-border p-0"></TableCell>
                        </TableRow>
                        {data?.spending.map((value, index) => (
                          <TableRow key={index}>
                            <TableCell className="nett-income-table-border p-0 ps-4">
                              {value.description}
                            </TableCell>
                            <TableCell className="nett-income-table-border p-0 text-end pe-2">
                              {Number(value.amount).toLocaleString("id-ID")}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="gray">
                          <TableCell className="nett-income-table-border fw-bold p-0 text-end pe-2">
                            Total Spending
                          </TableCell>
                          <TableCell className="nett-income-table-border fw-bold p-0 text-end pe-2">
                            {Number(
                              data?.spending.reduce(
                                (sum, item) => sum + item.amount,
                                0
                              )
                            ).toLocaleString("id-ID")}
                          </TableCell>
                        </TableRow>
                        <TableRow className="gray">
                          <TableCell className="border border-top-0 border-black fw-bold p-0 text-end pe-2">
                            Nett Income
                          </TableCell>
                          <TableCell className="border border-top-0 border-black fw-bold p-0 text-end pe-2">
                            {Number(
                              data?.spending.reduce(
                                (sum, item) => sum + item.amount,
                                0
                              )
                            ).toLocaleString("id-ID")}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <div className="w-100 d-flex justify-content-center">
                            <div
                              className="spinner-border d-flex justify-content-center"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
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
      </PageLayout>
    </>
  );
}
