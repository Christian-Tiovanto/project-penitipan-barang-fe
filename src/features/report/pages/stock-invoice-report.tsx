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
import { useStockInvoiceReport } from "../hooks/stock-invoice-report";
import { Invoice } from "./invoice-list";
import { StockInvoiceReportService } from "../services/stock-invoice-report.service";
export interface IStockInvoiceReportData {
  invoiceId: string;
  product_name: string;
  customer_name: string;
  invoice_no: string;
  product_in: number;
  product_out: number;
  product_remaining: number;
  created_at: Date;
}
type TableData = IStockInvoiceReportData & {
  row_no: number;
  final_qty: number;
};

const columns: HeadCell<TableData>[] = [
  {
    field: "row_no",
    headerName: "No",
    headerStyle: {
      width: "1%",
    },
  },
  {
    field: "invoice_no",
    headerName: "Invoice No",
    headerStyle: {
      width: "20%",
    },
  },
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
    field: "product_in",
    headerName: "Product In",
    headerStyle: {
      width: "10%",
      textWrap: "nowrap",
    },
  },
  {
    field: "product_out",
    headerName: "Product Out",
    headerStyle: {
      width: "10%",
      textWrap: "nowrap",
    },
  },
  {
    field: "product_remaining",
    headerName: "Product Remaining",
    headerStyle: {
      width: "10%",
      textWrap: "nowrap",
    },
  },
  {
    field: "created_at",
    headerName: "Tanggal Invoice",
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

        {columns.slice(1).map((col) => (
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

export function StockInvoiceReportPage() {
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  //   const [endDate, setEndDate] = useState(startOfTomorrow());
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof TableData>("product_name");
  const stockInvoiceReportService = new StockInvoiceReportService();

  const { data, isLoading } = useStockInvoiceReport({ invoice: invoiceId });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const fetchInvoices = async () => {
    try {
      const invoices = await stockInvoiceReportService.getAllInvoices();
      setInvoices(invoices);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleInvoiceDropdownChange = (value: string) => {
    setInvoiceId(value);
  };

  useEffect(() => {
    fetchInvoices();
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
        case "invoice_no":
          return order === "asc"
            ? a.invoice_no.localeCompare(b.invoice_no)
            : b.invoice_no.localeCompare(a.invoice_no);

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

        case "product_remaining":
          return order === "asc"
            ? a.product_remaining - b.product_remaining
            : b.product_remaining - a.product_remaining;

        default:
          return 0;
      }
    });
  }, [data, order, orderBy]);
  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="row">
          {/* <div className="col-md-6 position-relative">
            <EndDatePicker
              idDatePicker="tanggal-akhir"
              titleText="Tanggal"
              datetime={false}
              value={endDate}
              onDateClick={(date: Date) => {
                setEndDate(date);
              }}
            />
          </div> */}
          <div className="col-md-6 position-relative">
            <DropdownSecondStyle
              id="invoice"
              label="Invoice *"
              value={invoiceId}
              options={invoices.map((invoice) => ({
                value: invoice.id.toString(),
                label: invoice.invoice_no,
              }))}
              onChange={handleInvoiceDropdownChange}
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
                  {sortedStockReport.map((value, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{value.invoice_no}</TableCell>
                      <TableCell>{value.product_name}</TableCell>
                      <TableCell>{value.customer_name}</TableCell>
                      <TableCell>
                        {Number(value.product_in).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {Number(value.product_out).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {Number(value.product_remaining).toLocaleString(
                          "id-ID"
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(value.created_at).toDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}
