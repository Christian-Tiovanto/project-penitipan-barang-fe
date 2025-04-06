import { useState } from "react";
import { StartDatePicker, EndDatePicker } from "../../components/date-picker";
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
import { useTransactionInReport } from "./hooks/report-in.hooks";
import { endOfToday, startOfToday, startOfTomorrow } from "date-fns";
import { useToast } from "../../contexts/toastContexts";
export interface ITransactionInData {
  id: number;
  product: {
    id: number;
    name: string;
  };
  customer: {
    id: number;
    name: string;
  };
  qty: number;
  converted_qty: number;
  unit: string;
}
export function ReportInPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState(startOfToday());
  const [endDate, setEndDate] = useState(startOfTomorrow());
  const { data, isLoading } = useTransactionInReport({
    startDate,
    endDate,
    pageNo: page,
    pageSize: rowsPerPage,
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns: ColumnConfig<ITransactionInData>[] = [
    {
      field: "product",
      headerName: "Product",
      headerStyle: {
        minWidth: "200px",
        width: "40%",
      },
    },
    {
      field: "customer",
      headerName: "Customer",
      headerStyle: {
        width: "20%",
      },
    },
    {
      field: "qty",
      headerName: "Quantity",
      headerStyle: {
        width: "10%",
      },
    },
    {
      field: "converted_qty",
      headerName: "Quantity (Kg)",
      headerStyle: {
        width: "20%",
      },
    },
    {
      field: "unit",
      headerName: "Unit",
      headerStyle: {
        width: "10%",
      },
    },
  ];

  const columnWidths = ["30%", "20%", "20%", "20%", "10%"];
  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-md-6 position-relative">
            <StartDatePicker
              idDatePicker="tanggal-awal-masuk-barang"
              titleText="Tanggal Awal"
              value={startDate}
              onDateClick={(date: Date) => {
                setStartDate(date);
              }}
              datetime={false}
            />
          </div>
          <div className="col-md-6 position-relative">
            <EndDatePicker
              idDatePicker="tanggal-akhir-masuk-barang"
              titleText="Tanggal Akhir"
              value={endDate}
              onDateClick={(date: Date) => {
                setEndDate(date);
              }}
              datetime={false}
            />
          </div>
        </div>
        <div className="product-in-list w-100 d-flex flex-column">
          <div className="mui-table-container">
            <TableContainer component={Paper} sx={{ padding: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell
                        key={col.field}
                        sx={{
                          width: col.headerStyle?.width,
                          minWidth: col.headerStyle?.minWidth,
                          textAlign: col.headerStyle?.textAlign,
                          fontWeight: "bold",
                        }}
                      >
                        <b>{col.headerName}</b>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
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
                  ) : (
                    data.map((value) => (
                      <TableRow key={value.id}>
                        <TableCell>{value.product.name}</TableCell>
                        <TableCell>{value.customer.name}</TableCell>
                        <TableCell>{value.qty}</TableCell>
                        <TableCell>{value.converted_qty}</TableCell>
                        <TableCell>{value.unit}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                sx={{ fontSize: "1.1rem" }}
                component="div"
                count={data.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}
