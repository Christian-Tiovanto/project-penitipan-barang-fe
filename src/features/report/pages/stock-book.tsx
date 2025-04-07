import { useEffect, useState } from "react";
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
import { visuallyHidden } from "@mui/utils";
import {
  EnhancedTableProps,
  HeadCell,
} from "../../../components/table-component";
import { startOfToday, startOfTomorrow } from "date-fns";
import { Order } from "../../../enum/SortOrder";
import { useStockBookReport } from "../hooks/stock-book.hooks";
import Dropdown from "../../../components/dropdown";
import { FaBox } from "react-icons/fa6";
import { getAllProducts } from "../../product/services/product.service";
import { Product } from "../../product-unit/pages/create-product-unit";
import DropdownSecondStyle from "../../../components/dropdown-2";
import { getAllCustomers } from "../../customer/services/customer.service";
import { Customer } from "../../customer-payment/pages/update-customer-payment";
import React from "react";

export interface IStockBookData {
  initial_qty: number;
  product: {
    id: number;
    name: string;
  };
  transactions: {
    date: Date;
    type: "Add" | "Out";
    qty: number;
  }[];
  final_qty: number;
}
type TableData = IStockBookData & {
  row_no: number;
  date: Date;
  type: "Add" | "Out";
  qty: number;
};
const columns: HeadCell<
  IStockBookData & {
    row_no: number;
    date: Date;
    type: "Add" | "Out";
    qty: number;
  }
>[] = [
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
// Add this utility function to calculate running totals
const calculateRunningTotals = (
  transactions: IStockBookData["transactions"],
  initialQty: number
) => {
  let runningTotal = initialQty;
  return transactions.map((transaction) => {
    runningTotal +=
      transaction.type === "Add" ? transaction.qty : -transaction.qty;
    return {
      ...transaction,
      final_qty: runningTotal,
    };
  });
};

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

        {columns.slice(1, 3).map((col) => (
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
        {columns.slice(3).map((col) => (
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
            {col.headerName}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function StockBookPage() {
  const [productId, setProductId] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [startDate, setStartDate] = useState(startOfToday());
  const [endDate, setEndDate] = useState(startOfTomorrow());
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof TableData>("date");
  const [errors, setErrors] = useState({
    customerId: "",
    productId: "",
  });
  const fetchCustomers = async () => {
    try {
      const customers = await getAllCustomers();
      setCustomers(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // In your component, remove the early return and use:
  const { data, isLoading } = useStockBookReport(productId, customerId, {
    startDate,
    endDate,
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const fetchProducts = async () => {
    try {
      const products = await getAllProducts();
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductDropdownChange = (value: string) => {
    setProductId(value);
  };
  const handleCustomerDropdownChange = (value: string) => {
    setCustomerId(value);
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const sortedTransactions = React.useMemo(() => {
    if (!data) return [];
    const transactionsCopy = [...data.transactions];

    // Sort transactions
    const sorted = transactionsCopy.sort((a, b) => {
      if (orderBy === "date") {
        return order === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (orderBy === "type") {
        return order === "asc"
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
      return 0;
    });

    return calculateRunningTotals(sorted, data.initial_qty);
  }, [data, order, orderBy]);

  // Calculate summary values
  const summary = React.useMemo(() => {
    if (!data) return null;

    const totalIn = data.transactions
      .filter((t) => t.type === "Add")
      .reduce((sum, t) => sum + t.qty, 0);

    const totalOut = data.transactions
      .filter((t) => t.type === "Out")
      .reduce((sum, t) => sum + t.qty, 0);

    return {
      initial: data.initial_qty,
      totalIn,
      totalOut,
      final: data.final_qty,
    };
  }, [data]);

  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-md-6 col-lg-4 position-relative mb-2">
            <StartDatePicker
              idDatePicker="tanggal-awal"
              titleText="Tanggal Awal"
              datetime={false}
              value={startDate}
              onDateClick={(date: Date) => {
                setStartDate(date);
              }}
            />
          </div>
          <div className="col-md-6 col-lg-4 position-relative mb-2">
            <EndDatePicker
              idDatePicker="tanggal-akhir"
              titleText="Tanggal Akhir"
              datetime={false}
              value={endDate}
              onDateClick={(date: Date) => {
                setEndDate(date);
              }}
            />
          </div>
          <div className="col-md-6 col-lg-4 position-relative">
            <DropdownSecondStyle
              id="product"
              label="Product *"
              value={productId}
              options={products.map((product) => ({
                value: product.id.toString(),
                label: product.name,
              }))}
              onChange={handleProductDropdownChange}
              error={!!errors.productId}
              errorMessage={errors.productId}
              icon={<FaBox />}
            />
          </div>
          <div className="col-md-6 col-lg-4 position-relative">
            <DropdownSecondStyle
              id="customer"
              label="Customer *"
              value={customerId}
              options={customers.map((product) => ({
                value: product.id.toString(),
                label: product.name,
              }))}
              onChange={handleCustomerDropdownChange}
              error={!!errors.productId}
              errorMessage={errors.productId}
              icon={<FaBox />}
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
            Stok Awal : {data?.initial_qty ? data.initial_qty : 0}
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
                <EnhancedTableHead
                  onRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                />
                <TableBody>
                  {productId && customerId && data ? (
                    <>
                      {/* Initial Stock Row */}
                      <TableRow className="blue-lighten">
                        <TableCell>1</TableCell>
                        <TableCell>
                          {new Date().toLocaleString("en-GB")}
                        </TableCell>
                        <TableCell>INITIAL STOCK</TableCell>
                        <TableCell>{data.product.name}</TableCell>
                        <TableCell className="text-end">
                          {data.initial_qty}
                        </TableCell>
                        <TableCell className="text-end">
                          {Number(data.initial_qty).toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>

                      {/* Transaction Rows */}
                      {sortedTransactions.map((transaction, index) => (
                        <TableRow
                          key={index}
                          className={`${
                            transaction.type === "Add"
                              ? "green-lighten"
                              : "red-lighten"
                          }`}
                        >
                          <TableCell>{index + 2}</TableCell>
                          <TableCell>
                            {new Date(transaction.date).toLocaleString("en-GB")}
                          </TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>{data.product.name}</TableCell>
                          <TableCell className="text-end">
                            {`${
                              transaction.type === "Add" ? "+" : "-"
                            } ${Number(transaction.qty).toLocaleString(
                              "id-ID"
                            )}`}
                          </TableCell>
                          <TableCell className="text-end">
                            {Number(transaction.final_qty).toLocaleString(
                              "id-ID"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Final Stock Row */}
                      <TableRow className="blue-lighten">
                        <TableCell>{sortedTransactions.length + 2}</TableCell>
                        <TableCell>
                          {new Date().toLocaleString("en-GB")}
                        </TableCell>
                        <TableCell>FINAL STOCK</TableCell>
                        <TableCell>{data.product.name}</TableCell>
                        <TableCell className="text-end">
                          {Number(data.final_qty).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-end">
                          {Number(data.final_qty).toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No Data Available
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
