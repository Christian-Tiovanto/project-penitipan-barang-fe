import { useState } from "react";
import { StartDatePicker } from "../../components/date-picker";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import { ColumnConfig } from "../../components/table-component";
interface IEarningData {
  total_invoice: number;
}
interface ISpendingData {
  desc: string;
  total: number;
}
export function NettIncomeReportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const earningData: IEarningData = {
    total_invoice: 1000000,
  };
  const spendingData: ISpendingData[] = [
    { desc: "Beban Gaji", total: 200000 },
    { desc: "Beban Pemasaran", total: 500000 },
    { desc: "Beban Server", total: 200000 },
  ];
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
      <div className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-md-6 position-relative">
            <StartDatePicker
              idDatePicker="tanggal-awal-nett-income"
              titleText="Start Date"
              datetime={false}
            />
          </div>
          <div className="col-md-6 position-relative">
            <StartDatePicker
              idDatePicker="tanggal-akhir-nett-income"
              titleText="End Date"
              datetime={false}
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
                      {Number(earningData.total_invoice).toLocaleString(
                        "id-ID"
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow className="gray">
                    <TableCell className="border border-top-0 border-black fw-bold p-0 pe-2 text-end">
                      Total Earning
                    </TableCell>
                    <TableCell className="border border-top-0 border-black fw-bold p-0 pe-2 text-end">
                      {Number(earningData.total_invoice).toLocaleString(
                        "id-ID"
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="nett-income-table-border fw-bold text-decoration-underline p-0 ps-2">
                      Cost
                    </TableCell>
                    <TableCell className="nett-income-table-border p-0"></TableCell>
                  </TableRow>
                  {spendingData.map((value, index) => (
                    <TableRow key={index}>
                      <TableCell className="nett-income-table-border p-0 ps-4">
                        {value.desc}
                      </TableCell>
                      <TableCell className="nett-income-table-border p-0 text-end pe-2">
                        {Number(value.total).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="gray">
                    <TableCell className="nett-income-table-border fw-bold p-0 text-end pe-2">
                      Total Spending
                    </TableCell>
                    <TableCell className="nett-income-table-border fw-bold p-0 text-end pe-2">
                      {Number(
                        spendingData.reduce((sum, item) => sum + item.total, 0)
                      ).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                  <TableRow className="gray">
                    <TableCell className="border border-top-0 border-black fw-bold p-0 text-end pe-2">
                      Nett Income
                    </TableCell>
                    <TableCell className="border border-top-0 border-black fw-bold p-0 text-end pe-2">
                      {Number(
                        spendingData.reduce((sum, item) => sum + item.total, 0)
                      ).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}
