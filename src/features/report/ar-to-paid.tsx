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
interface IArToPaidData {
  id: number;
  invoice_date: Date;
  ar_no: string;
  customer: {
    id: number;
    name: string;
  };
  total_bill: number;
  to_paid: number;
}
export function ArToPaidPage() {
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

  const TransactionInData: IArToPaidData[] = [
    {
      id: 1,
      invoice_date: new Date(),
      customer: {
        id: 1,
        name: "Chris",
      },
      ar_no: "FK-JK1234",
      total_bill: 150000,
      to_paid: 0,
    },
    {
      id: 2,
      invoice_date: new Date(),
      customer: {
        id: 2,
        name: "Tiovan",
      },
      ar_no: "FK-JK155555",
      total_bill: 15000,
      to_paid: 0,
    },
  ];
  const columns: ColumnConfig<IArToPaidData & { row_no: number }>[] = [
    {
      field: "row_no",
      headerName: "No",
      headerStyle: {
        width: "1%",
      },
    },
    {
      field: "invoice_date",
      headerName: "Invoice Date",
      headerStyle: {
        width: "10%",
      },
    },
    {
      field: "ar_no",
      headerName: "Invoice No",
      headerStyle: {
        width: "10%",
      },
    },
    {
      field: "customer",
      headerName: "Customer",
      headerStyle: {
        width: "10%",
      },
    },
    {
      field: "total_bill",
      headerName: "Total Bill",
      headerStyle: {
        width: "10%",
      },
    },
    {
      field: "to_paid",
      headerName: "To Paid",
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
                  {TransactionInData.map((value, index) => (
                    <TableRow key={value.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {value.invoice_date.toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell>{value.ar_no}</TableCell>
                      <TableCell>{value.customer.name}</TableCell>
                      <TableCell>
                        {Number(value.total_bill).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {Number(value.to_paid).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3}></TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
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
