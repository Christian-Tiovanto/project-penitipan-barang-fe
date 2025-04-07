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
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";

import {
  EnhancedTableProps,
  HeadCell,
} from "../../../components/table-component";
import { startOfToday, startOfTomorrow } from "date-fns";
import { visuallyHidden } from "@mui/utils";
import { Order } from "../../../enum/SortOrder";

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
  stock: number;
}
type TableData = ICustomerProductStockData;
const columns: HeadCell<TableData>[] = [
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
    field: "stock",
    headerName: "Stock",
    headerStyle: {
      width: "10%",
      textWrap: "nowrap",
    },
  },
];
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
export function CustomerProductStockPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState(startOfToday());
  const [endDate, setEndDate] = useState(startOfTomorrow());
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof TableData>("product");

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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
      stock: 500,
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
      stock: 500,
    },
  ];

  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-md-6 position-relative">
            <StartDatePicker
              idDatePicker="tanggal-awal"
              titleText="Start Date"
              value={startDate}
              onDateClick={(date: Date) => {
                setStartDate(date);
              }}
              datetime={false}
            />
          </div>
          <div className="col-md-6 position-relative">
            <EndDatePicker
              idDatePicker="tanggal-akhir"
              titleText="End Date"
              value={endDate}
              onDateClick={(date: Date) => {
                setEndDate(date);
              }}
              datetime={false}
            />
          </div>
        </div>
        <div className="w-100 d-flex flex-column">
          <div className="mui-table-container">
            <TableContainer component={Paper} sx={{ padding: 2 }}>
              <Table>
                <EnhancedTableHead
                  onRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                />
                <TableBody>
                  {TransactionInData.map((value, index) => (
                    <TableRow key={value.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{value.product.name}</TableCell>
                      <TableCell>{value.customer.name}</TableCell>
                      <TableCell>
                        {Number(value.stock).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {Number(10000).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <TablePagination
                sx={{ fontSize: "1.1rem" }}
                component="div"
                count={TransactionInData.length}
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
