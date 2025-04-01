import { useState } from "react";
import DatePicker from "../../components/date-picker";
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
interface ICustomerProductStockData {
  id: number;
  product: {
    id: number;
    name: string;
  };
  customer: {
    id: number;
    name: string;
  };
  initial_qty: number;
  product_in: number;
  product_out: number;
  final_qty: number;
}
export function CustomerProductStockPage() {
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

  const TransactionInData: ICustomerProductStockData[] = [
    {
      id: 1,
      product: {
        id: 1,
        name: "Product Name",
      },
      customer: {
        id: 1,
        name: "Chris",
      },
      initial_qty: 500,
      product_in: 500,
      product_out: 500,
      final_qty: 500,
    },
    {
      id: 2,
      product: {
        id: 1,
        name: "Product Name",
      },
      customer: {
        id: 2,
        name: "Tiovan",
      },
      initial_qty: 500,
      product_in: 500,
      product_out: 500,
      final_qty: 500,
    },
  ];
  const columns: ColumnConfig<
    ICustomerProductStockData & { row_no: number }
  >[] = [
    {
      field: "row_no",
      headerName: "No",
      headerStyle: {
        width: "1%",
      },
    },
    {
      field: "product",
      headerName: "Product",
      headerStyle: {
        width: "20%",
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
      field: "initial_qty",
      headerName: "Initial Qty",
      headerStyle: {
        width: "10%",
      },
    },
    {
      field: "product_in",
      headerName: "Product In",
      headerStyle: {
        width: "10%",
      },
    },
    {
      field: "product_out",
      headerName: "Product Out",
      headerStyle: {
        width: "10%",
      },
    },
    {
      field: "final_qty",
      headerName: "Final Qty",
      headerStyle: {
        width: "10%",
      },
    },
  ];
  const filteredData = TransactionInData.filter((row: any) =>
    columns.some((col) =>
      String(row[col.field]).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-md-6 position-relative">
            <DatePicker
              idDatePicker="tanggal-awal-masuk-barang"
              titleText="Tanggal Awal"
              datetime={false}
            />
          </div>
          <div className="col-md-6 position-relative">
            <DatePicker
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
                  {TransactionInData.map((value, index) => (
                    <TableRow key={value.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{value.product.name}</TableCell>
                      <TableCell>{value.customer.name}</TableCell>
                      <TableCell>
                        {Number(value.initial_qty).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {Number(value.product_in).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {Number(value.product_out).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {Number(value.final_qty).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {Number(10000).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {Number(10000).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {Number(10000).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {Number(10000).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
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
