import { useMemo, useState } from "react";
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
import { IStockReportData } from "./stock-report";
import { useCustomerProductReport } from "../hooks/customer-product.hooks";

type TableData = IStockReportData & { final_qty: number };
const columns: HeadCell<TableData>[] = [
  {
    field: "product_name",
    headerName: "Product",
    headerStyle: {
      width: "20%",
    },
  },
  {
    field: "customer_name",
    headerName: "Customer",
    headerStyle: {
      width: "20%",
    },
  },
  {
    field: "final_qty",
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
  const [endDate, setEndDate] = useState(startOfTomorrow());
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof TableData>("product_name");

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const { data, isLoading } = useCustomerProductReport({
    endDate,
  });
  const sortedCustomerProductReport = useMemo(() => {
    console.log("data");
    console.log(data);
    if (!data) return [];

    const processedData = data.map((item) => ({
      ...item,
      final_qty: item.product_in - item.product_out,
    }));

    return processedData.sort((a, b) => {
      // Sorting logic for each column
      switch (orderBy) {
        case "product_name":
          return order === "asc"
            ? a.product_name.localeCompare(b.product_name)
            : b.product_name.localeCompare(a.product_name);

        case "customer_name":
          return order === "asc"
            ? a.customer_name.localeCompare(b.customer_name)
            : b.customer_name.localeCompare(a.customer_name);

        case "final_qty":
          return order === "asc"
            ? a.final_qty - b.final_qty
            : b.final_qty - a.final_qty;

        default:
          return 0;
      }
    });
  }, [data, order, orderBy]);

  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="row">
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
                  {!isLoading ? (
                    <>
                      {sortedCustomerProductReport.map((value, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{value.product_name}</TableCell>
                          <TableCell>{value.customer_name}</TableCell>
                          <TableCell>
                            {Number(
                              value.product_in - value.product_out
                            ).toLocaleString("id-ID")}
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
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
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
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}
