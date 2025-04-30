import { useEffect, useState } from "react";
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
  TableRow,
  TableSortLabel,
} from "@mui/material";

import {
  EnhancedTableProps,
  HeadCell,
} from "../../../components/table-component";
import { format, startOfToday, startOfTomorrow } from "date-fns";
import { Order } from "../../../enum/SortOrder";
import PageLayout from "../../../components/page-location";
import { useCustomerProductMutation } from "../hooks/customer-product-mutation.hooks";
import React from "react";
import { Customer } from "../../customer-payment/pages/update-customer-payment";
import { getAllCustomers } from "../../customer/services/customer.service";
import { useToast } from "../../../contexts/toastContexts";
import DropdownSecondStyle from "../../../components/dropdown-2";
import { FaBox } from "react-icons/fa6";

export interface ICustomerProductMutation {
  productId: number;
  initialValue: number;
  productName: string;
  records: {
    date: Date;
    name: string;
    qty_in: number;
    qty_out: number;
  }[];
}
type TableData = ICustomerProductMutation & {
  date: Date;
  final_qty: number;
  qty_in: number;
  qty_out: number;
};

const columns: HeadCell<TableData>[] = [
  {
    field: "date",
    headerName: "Date",
    headerStyle: {
      width: "30%",
    },
  },
  {
    field: "qty_in",
    headerName: "Product In",
    headerStyle: {
      textAlign: "center",
      minWidth: "200px",
      width: "20%",
    },
  },
  {
    field: "qty_out",
    headerName: "Product Out",
    headerStyle: {
      textAlign: "center",
      width: "30%",
    },
  },
  {
    field: "final_qty",
    headerName: "Final Stock",
    headerStyle: {
      textAlign: "center",
      width: "30%",
    },
  },
];
function EnhancedTableHead(
  props: EnhancedTableProps<ICustomerProductMutation>
) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof ICustomerProductMutation) =>
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
            {col.headerName}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
export function CustomerProductMutationPage() {
  const [customerId, setCustomerId] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [startDate, setStartDate] = useState(startOfToday());
  const [endDate, setEndDate] = useState(startOfTomorrow());
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] =
    useState<keyof ICustomerProductMutation>("productName");
  const { showToast } = useToast();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ICustomerProductMutation
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleCustomerDropdownChange = (value: string) => {
    setCustomerId(value);
  };
  const fetchCustomers = async () => {
    try {
      const customers = await getAllCustomers();
      setCustomers(customers);
    } catch (err) {
      const finalMessage = `Failed to get data.\n${
        err?.response?.data?.message || err?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");

      console.error("Error fetching customers:", err);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

  const { response, isLoading } = useCustomerProductMutation(customerId, {
    startDate,
    endDate,
  });

  return (
    <>
      <PageLayout title="Report" items={["Customer Product Mutation"]}>
        <div className="container-fluid m-0 p-0">
          <div className="row">
            <div className="col-md-6 col-lg-4 position-relative mb-2">
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
            <div className="col-md-6 col-lg-4 position-relative mb-2">
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
            <div className="col-md-6 col-lg-4 position-relative">
              <DropdownSecondStyle
                id="customer"
                label="Customer *"
                value={customerId}
                options={customers.map((customer) => ({
                  value: customer.id.toString(),
                  label: customer.name,
                }))}
                onChange={handleCustomerDropdownChange}
                icon={<FaBox />}
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
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      response.map((product, productIndex) => {
                        let cumulative = product.initialValue;
                        let totalIn = 0;
                        let totalOut = 0;

                        const recordRows = product.records.map(
                          (record, index) => {
                            totalIn += record.qty_in;
                            totalOut += record.qty_out;
                            const final_qty =
                              cumulative + record.qty_in - record.qty_out;
                            cumulative = final_qty;

                            return (
                              <TableRow key={`${product.productId}-${index}`}>
                                <TableCell>
                                  {format(new Date(record.date), "yyyy-MM-dd")}
                                </TableCell>
                                <TableCell
                                  sx={{ textAlign: "center", border: "none" }}
                                >
                                  {record.qty_in}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    textAlign: "center",
                                    border: "0px",
                                  }}
                                >
                                  {record.qty_out}
                                </TableCell>
                                <TableCell
                                  sx={{ textAlign: "center", border: "none" }}
                                >
                                  {final_qty}
                                </TableCell>
                              </TableRow>
                            );
                          }
                        );

                        return (
                          <React.Fragment key={product.productId}>
                            {
                              <TableRow>
                                <TableCell
                                  className="fw-bold text-decoration-underline"
                                  colSpan={4}
                                  sx={{
                                    border: "0px",
                                    paddingTop: "12px",
                                    paddingBottom: "2px",
                                  }}
                                >
                                  {product.productName}
                                </TableCell>
                              </TableRow>
                            }
                            {recordRows}

                            {/* Summary Row */}
                            <TableRow>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  backgroundColor: "action.hover",
                                  borderBottom: "1px solid black",
                                }}
                              >
                                Subtotal {product.productName}
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  backgroundColor: "action.hover",
                                  borderBottom: "1px solid black",
                                }}
                              >
                                {totalIn}
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  backgroundColor: "action.hover",
                                  borderBottom: "1px solid black",
                                }}
                              >
                                {totalOut}
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  backgroundColor: "action.hover",
                                  borderBottom: "1px solid black",
                                }}
                              >
                                {product.initialValue + totalIn - totalOut}
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })
                    )}
                  </TableBody>{" "}
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
