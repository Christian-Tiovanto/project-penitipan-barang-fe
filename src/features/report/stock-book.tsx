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
interface IInvoiceProductStockData {
  date: Date;
  type: string;
  product: {
    id: number;
    name: string;
  };
  qty: number;
  final_qty: number;
}
export function StockBookPage() {
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

  const TransactionInData: IInvoiceProductStockData[] = [
    {
      date: new Date(),
      type: "Add",
      product: {
        id: 1,
        name: "Product Name",
      },
      qty: 50,
      final_qty: 50,
    },
    {
      date: new Date(),
      type: "Out",
      product: {
        id: 1,
        name: "Product Name",
      },
      qty: 50,
      final_qty: 50,
    },
  ];
  const columns: ColumnConfig<IInvoiceProductStockData & { row_no: number }>[] =
    [
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
        field: "product",
        headerName: "Product",
        headerStyle: {
          width: "20%",
        },
      },
      {
        field: "qty",
        headerName: "Stock",
        headerStyle: {
          width: "10%",
        },
      },
      {
        field: "final_qty",
        headerName: "Final Stock",
        headerStyle: {
          width: "10%",
          textAlign: "center",
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
          <div className="col-md-6 col-lg-4 position-relative">
            <DatePicker
              idDatePicker="tanggal-awal-masuk-barang"
              titleText="Tanggal Awal"
              datetime={false}
            />
          </div>
          <div className="col-md-6 col-lg-4 position-relative">
            <DatePicker
              idDatePicker="tanggal-akhir-masuk-barang"
              titleText="Tanggal Akhir"
              datetime={false}
            />
          </div>
          <div className="col-md-6 col-lg-4 position-relative">
            <DatePicker
              idDatePicker="tanggal-akhir-masuk-barang"
              titleText="Tanggal Akhir"
              datetime={false}
            />
          </div>
          <div className="col-md-6 col-lg-4 position-relative">
            <DatePicker
              idDatePicker="tanggal-akhir-masuk-barang"
              titleText="Tanggal Akhir"
              datetime={false}
            />
          </div>
        </div>
        <div className="container-fluid d-flex my-4 flex-wrap justify-content-center gap-2">
          <div
            className="container border rounded-pill d-flex justify-content-center align-items-center py-2 mx-2 blue-lighten"
            style={{
              fontSize: "13px",
              minWidth: "115px",
              maxHeight: "37.5px",
              maxWidth: "115px",
            }}
          >
            Stok Awal : 0
          </div>
          <div
            className="container border rounded-pill d-flex justify-content-center align-items-center py-2 mx-2 green-lighten"
            style={{
              fontSize: "13px",
              minWidth: "115px",
              maxHeight: "37.5px",
              maxWidth: "115px",
            }}
          >
            Total Masuk : 0
          </div>
          <div
            className="container border rounded-pill d-flex justify-content-center align-items-center py-2 mx-2 red-lighten"
            style={{
              fontSize: "13px",
              minWidth: "115px",
              maxHeight: "37.5px",
              maxWidth: "115px",
            }}
          >
            Total keluar : 0
          </div>
          <div
            className="container border rounded-pill d-flex justify-content-center align-items-center py-2 mx-2 teal-lighten"
            style={{
              fontSize: "13px",
              minWidth: "115px",
              maxHeight: "37.5px",
              maxWidth: "115px",
            }}
          >
            Stok Akhir : 0
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
                  <TableRow className="blue-lighten">
                    <TableCell>1</TableCell>
                    <TableCell>{new Date().toLocaleString("en-GB")}</TableCell>
                    <TableCell>INITIAL STOCK</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell className="text-end">
                      {Number(50).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-end">
                      {Number(100).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>

                  {TransactionInData.map((value, index) => (
                    <TableRow
                      key={index}
                      className={`${
                        value.type === "Add" ? "green-lighten" : "red-lighten"
                      }`}
                    >
                      <TableCell>{index + 2}</TableCell>
                      <TableCell>
                        {value.date.toLocaleString("en-GB")}
                      </TableCell>
                      <TableCell>{value.type}</TableCell>
                      <TableCell>{value.product.name}</TableCell>
                      <TableCell className="text-end">
                        {`${value.type === "Add" ? "+" : "-"} ${Number(
                          value.qty
                        ).toLocaleString("id-ID")}`}
                      </TableCell>
                      <TableCell className="text-end">
                        {Number(value.final_qty).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="blue-lighten">
                    <TableCell>3</TableCell>
                    <TableCell>{new Date().toLocaleString("en-GB")}</TableCell>
                    <TableCell>FINAL STOCK</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell className="text-end">
                      {Number(50).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-end">
                      {Number(100).toLocaleString("id-ID")}
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
