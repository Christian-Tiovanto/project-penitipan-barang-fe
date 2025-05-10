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
import { startOfTomorrow } from "date-fns";
import { Order } from "../../../enum/SortOrder";
import DropdownSecondStyle from "../../../components/dropdown-2";
import { Customer } from "../../customer-payment/pages/update-customer-payment";
import { getAllCustomers } from "../../customer/services/customer.service";
import { useStockReport } from "../hooks/stock-report.hooks";
import { FaBox } from "react-icons/fa6";
import React from "react";
import PageLayout from "../../../components/page-location";
import { getAllProducts } from "../../product/services/product.service";
import { Product } from "../../product-unit/pages/create-product-unit";
import { ProductUnit } from "../../trans-in/pages/create-trans-in";
export interface IStockReportData {
  product_name: string;
  customer_name: string;
  customerId: number;
  productId: number;
  product_in: number;
  product_out: number;
  product_unit: ProductUnit;
}
type TableData = IStockReportData & { row_no: number; final_qty: number };

const columns: HeadCell<TableData>[] = [
  {
    field: "row_no",
    headerName: "No",
    headerStyle: {
      width: "1%",
    },
  },
  {
    field: "product_name",
    headerName: "Product",
    headerStyle: {
      width: "20%",
      // textWrap: "nowrap",
    },
  },
  // {
  //   field: "customer_name",
  //   headerName: "Customer",
  //   headerStyle: {
  //     width: "20%",
  //   },
  // },
  {
    field: "product_in",
    headerName: "Product In (Kg)",
    headerStyle: {
      width: "13%",
      // textWrap: "nowrap",
    },
  },
  {
    field: "product_unit",
    headerName: "Product In (Unit)",
    headerStyle: {
      width: "13%",
      textWrap: "nowrap",
    },
  },
  {
    field: "product_out",
    headerName: "Product Out (Kg)",
    headerStyle: {
      width: "13%",
      // textWrap: "nowrap",
    },
  },
  {
    field: "product_unit",
    headerName: "Product Out (Unit)",
    headerStyle: {
      width: "13%",
      // textWrap: "nowrap",
    },
  },
  {
    field: "product_unit",
    headerName: "Final Qty (Unit)",
    headerStyle: {
      width: "13%",
      // textWrap: "nowrap",
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
          className="fw-bold"
          sx={{
            width: "1%",
            fontWeight: "bold",
          }}
        >
          No
        </TableCell>

        {columns.slice(1).map((col) => (
          <TableCell
            className="fw-bold"
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

export function StockReportPage() {
  const [customerId, setCustomerId] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [endDate, setEndDate] = useState(startOfTomorrow());
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof TableData>("product_name");
  const [products, setProducts] = useState<Map<number, ProductUnit[]>>(
    new Map()
  );

  const fetchProducts = async () => {
    try {
      const productsGet: Product[] = await getAllProducts();
      setProducts(
        new Map(
          productsGet.map((product) => [product.id, product.product_unit])
        )
      );
      const tes = new Map(
        productsGet.map((product) => [product.id, product.product_unit])
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const { data, isLoading } = useStockReport({ endDate, customer: customerId });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const fetchCustomers = async () => {
    try {
      const customers = await getAllCustomers();
      setCustomers(customers);
      if (customers.length > 0) {
        setCustomerId(customers[0].id.toString());
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleCustomerDropdownChange = (value: string) => {
    setCustomerId(value);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const sortedStockReport = React.useMemo(() => {
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

        case "product_in":
          return order === "asc"
            ? a.product_in - b.product_in
            : b.product_in - a.product_in;

        case "product_out":
          return order === "asc"
            ? a.product_out - b.product_out
            : b.product_out - a.product_out;

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
      <PageLayout title="Report" items={["Stock Report"]}>
        <div className="container-fluid m-0 p-0">
          <div className="row">
            <div className="col-md-6 position-relative">
              <EndDatePicker
                idDatePicker="tanggal-akhir"
                titleText="Date"
                datetime={false}
                value={endDate}
                onDateClick={(date: Date) => {
                  setEndDate(date);
                }}
              />
            </div>
            <div className="col-md-6 position-relative">
              <DropdownSecondStyle
                id="customer"
                label="Customer *"
                value={customerId}
                options={customers.map((product) => ({
                  value: product.id.toString(),
                  label: product.name,
                }))}
                onChange={handleCustomerDropdownChange}
                icon={<FaBox />}
              />
            </div>
          </div>
          <div className="product-in-list w-100 d-flex flex-column">
            <div className="p-2">
              <h3>
                {customers.find((c) => c.id === parseInt(customerId, 10))
                  ?.name || "-"}
              </h3>
            </div>
            <div className="mui-table-container">
              <TableContainer component={Paper} sx={{ padding: 2 }}>
                <Table>
                  <EnhancedTableHead
                    onRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                  />
                  <TableBody>
                    {sortedStockReport.map((value, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{value.product_name}</TableCell>
                        {/* <TableCell>{value.customer_name}</TableCell> */}
                        <TableCell>
                          {Number(value.product_in).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          {Number(
                            value.product_in /
                              (products.get(value.productId)[0]
                                ?.conversion_to_kg ?? 1)
                          ).toLocaleString("id-ID")}{" "}
                          {products.get(value.productId)[0].name ?? "Unit"}
                        </TableCell>
                        <TableCell>
                          {Number(value.product_out).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          {Number(
                            value.product_out /
                              (products.get(value.productId)[0]
                                ?.conversion_to_kg ?? 1)
                          ).toLocaleString("id-ID")}{" "}
                          {products.get(value.productId)[0].name ?? "Unit"}
                        </TableCell>
                        <TableCell>
                          {Number(
                            (value.product_in - value.product_out) /
                              (products.get(value.productId)[0]
                                ?.conversion_to_kg ?? 1)
                          ).toLocaleString("id-ID")}{" "}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
