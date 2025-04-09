import { useState } from "react";
import {
  StartDatePicker,
  EndDatePicker,
} from "../../../components/date-picker";
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
import { visuallyHidden } from "@mui/utils";
import { useTransactionInReport } from "../hooks/report-in.hooks";
import { startOfToday, startOfTomorrow } from "date-fns";
import { Order } from "../../../enum/SortOrder";
import {
  EnhancedTableProps,
  HeadCell,
} from "../../../components/table-component";
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

const columns: HeadCell<ITransactionInData>[] = [
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

function EnhancedTableHead(props: EnhancedTableProps<ITransactionInData>) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof ITransactionInData) =>
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
export function ReportInPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState(startOfToday());
  const [endDate, setEndDate] = useState(startOfTomorrow());
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof ITransactionInData>("product");

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ITransactionInData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const { response, isLoading } = useTransactionInReport({
    startDate,
    endDate,
    pageNo: page,
    pageSize: rowsPerPage,
    order,
    sortBy: orderBy,
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-md-6 position-relative mb-2">
            <StartDatePicker
              idDatePicker="tanggal-awal-masuk-barang"
              titleText="Start Date"
              value={startDate}
              onDateClick={(date: Date) => {
                setStartDate(date);
              }}
              datetime={false}
            />
          </div>
          <div className="col-md-6 position-relative mb-2">
            <EndDatePicker
              idDatePicker="tanggal-akhir-masuk-barang"
              titleText="End Date"
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
                <EnhancedTableHead
                  onRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                />
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
                    response.data.map((value) => (
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
                count={response.data.length > 0 ? response.meta.total_count : 0}
                rowsPerPage={
                  response.data.length > 0 ? response.meta.page_size : 5
                }
                page={response.data.length > 0 ? response.meta.page_no - 1 : 0}
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
