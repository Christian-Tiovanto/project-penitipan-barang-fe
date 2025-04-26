import { useState } from "react";
import {
  EndDatePicker,
  StartDatePicker,
} from "../../../components/date-picker";
import { visuallyHidden } from "@mui/utils";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";

import {
  EnhancedTableProps,
  HeadCell,
} from "../../../components/table-component";
import { startOfToday, startOfTomorrow } from "date-fns";
import { Order } from "../../../enum/SortOrder";
import { useTransactionOutReport } from "../hooks/report-out.hooks";
import PageLayout from "../../../components/page-location";
export interface ITransactionOutData {
  id: number;
  product: {
    id: number;
    name: string;
  };
  customer: {
    id: number;
    name: string;
  };
  invoice: {
    id: number;
    invoice_no: string;
  };
  is_charge: boolean;
  converted_qty: number;
  total_days: number;
}
const columns: HeadCell<ITransactionOutData>[] = [
  {
    field: "invoice",
    headerName: "Invoice No",
    headerStyle: {
      width: "20%",
    },
  },
  {
    field: "product",
    headerName: "Product",
    headerStyle: {
      minWidth: "200px",
      width: "20%",
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
  {
    field: "is_charge",
    headerName: "Charge",
    headerStyle: {
      width: "30%",
    },
  },
];
function EnhancedTableHead(props: EnhancedTableProps<ITransactionOutData>) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof ITransactionOutData) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {columns.map((col) => (
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
      </TableRow>
    </TableHead>
  );
}
export function ReportOutPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState(startOfToday());
  const [endDate, setEndDate] = useState(startOfTomorrow());
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof ITransactionOutData>("product");

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ITransactionOutData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const { response, isLoading } = useTransactionOutReport({
    startDate,
    endDate,
    pageNo: page,
    pageSize: rowsPerPage,
    order,
    sortBy: orderBy,
  });

  return (
    <>
      <PageLayout title="Report" items={["Transaction Out"]}>
        <div className="container-fluid m-0 p-0">
          <div className="row">
            <div className="col-md-6 position-relative mb-2">
              <StartDatePicker
                idDatePicker="tanggal-awal-keluar-barang"
                titleText="Start Date"
                datetime={false}
                value={startDate}
                onDateClick={(date: Date) => {
                  setStartDate(date);
                }}
              />
            </div>
            <div className="col-md-6 position-relative mb-2">
              <EndDatePicker
                idDatePicker="tanggal-akhir-keluar-barang"
                titleText="End Date"
                datetime={false}
                value={endDate}
                onDateClick={(date: Date) => {
                  setEndDate(date);
                }}
              />
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
                  {/* <TableHead>
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
                </TableHead> */}
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5}>
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
                    ) : (
                      response.data.map((value) => (
                        <TableRow key={value.id}>
                          <TableCell>{value.invoice.invoice_no}</TableCell>
                          <TableCell>{value.product.name}</TableCell>
                          <TableCell>{value.customer.name}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {value.converted_qty}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {value.total_days}
                          </TableCell>
                          <TableCell>
                            {value.is_charge ? "Active" : "Inactive"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <TablePagination
                  sx={{ fontSize: "1.1rem" }}
                  component="div"
                  count={
                    response.data.length > 0 ? response.meta.total_count : 0
                  }
                  rowsPerPage={
                    response.data.length > 0 ? response.meta.page_size : 5
                  }
                  page={
                    response.data.length > 0 ? response.meta.page_no - 1 : 0
                  }
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </TableContainer>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
