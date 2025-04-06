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
interface ITransactionOutData {
  id: number;
  product: {
    id: number;
    name: string;
  };
  customer: {
    id: number;
    name: string;
  };
  converted_qty: number;
  total_days: number;
}
export function ReportOutPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const TransactionOutData: ITransactionOutData[] = [
    {
      id: 1,
      product: { id: 1, name: "Product Name" },
      customer: { id: 1, name: "Customer Name" },
      converted_qty: 500,
      total_days: 5,
    },
    {
      id: 2,
      product: {
        id: 1,
        name: "Lorem ipsum dolor sit amet consectetur.",
      },
      customer: { id: 1, name: "Customer Name" },
      converted_qty: 500,
      total_days: 50,
    },
  ];
  const columns: ColumnConfig<ITransactionOutData>[] = [
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
        width: "30%",
      },
    },
    {
      field: "converted_qty",
      headerName: "Quantity (Kg)",
      headerStyle: {
        textAlign: "center",
        width: "20%",
      },
    },
    {
      field: "total_days",
      headerName: "Total Days",
      headerStyle: {
        textAlign: "center",
        width: "10%",
      },
    },
  ];
  const filteredData = TransactionOutData.filter((row: any) =>
    columns.some((col) =>
      String(row[col.field]).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-md-6 position-relative">
            <StartDatePicker
              idDatePicker="tanggal-awal-masuk-barang"
              titleText="Tanggal Awal"
              datetime={false}
            />
          </div>
          <div className="col-md-6 position-relative">
            <StartDatePicker
              idDatePicker="tanggal-akhir-masuk-barang"
              titleText="Tanggal Akhir"
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
                  {TransactionOutData.map((value) => (
                    <TableRow key={value.id}>
                      <TableCell>{value.product.name}</TableCell>
                      <TableCell>{value.customer.name}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {value.converted_qty}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {value.total_days}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                sx={{ fontSize: "1.1rem" }}
                component="div"
                count={filteredData.length}
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
