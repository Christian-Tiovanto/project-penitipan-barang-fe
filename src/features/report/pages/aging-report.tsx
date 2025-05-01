import { useEffect, useState } from "react";
import {
  EndDatePicker,
  StartDatePicker,
} from "../../../components/date-picker";
import {
  Box,
  IconButton,
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
import { FaBox, FaPrint, FaUser } from "react-icons/fa6";
import React from "react";
import { useStockInvoiceReport } from "../hooks/stock-invoice-report.hooks";
import { Invoice } from "./invoice-list";
import { StockInvoiceReportService } from "../services/stock-invoice-report.service";
import PageLayout from "../../../components/page-location";
import { useToast } from "../../../contexts/toastContexts";
import { useAgingReport } from "../hooks/aging-report.hooks";
import { AgingReportService } from "../services/aging-report.service";
import { data } from "react-router";
import { formatDateReport } from "../../../utils/date";
import { generateAgingHtml } from "../../template/aging.template";
export interface IAgingReportData {
  code: string;
  product_name: string;
  customer_name: string;
  unit: string;
  remaining_qty: number;
  conversion_to_kg: number;
  created_at: Date;
}
type TableData = IAgingReportData & {
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
    field: "product_name",
    headerName: "Stock Description",
    headerStyle: {
      width: "20%",
    },
  },

  {
    field: "created_at",
    headerName: "Date Store",
    headerStyle: {
      width: "20%",
      textWrap: "nowrap",
    },
  },
  {
    field: "code",
    headerName: "No Job",
    headerStyle: {
      width: "20%",
      textWrap: "nowrap",
    },
  },
  {
    field: "remaining_qty",
    headerName: "Qty Left",
    headerStyle: {
      width: "20%",
      textWrap: "nowrap",
    },
  },
  {
    field: "remaining_qty",
    headerName: "Vol / Kg",
    headerStyle: {
      width: "20%",
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
            key={col.headerName} // saya ubah menjadi col.headername karena col.field memiliki value yang sama
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

export function AgingReportPage() {
  const [customerId, setCustomerId] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  //   const [endDate, setEndDate] = useState(startOfTomorrow());
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof TableData>("product_name");
  const agingReportService = new AgingReportService();
  const { showToast } = useToast();

  const { data, isLoading } = useAgingReport({ customer: customerId });

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
      const customers = await agingReportService.getAllCustomers();
      setCustomers(customers);
      setCustomerId(customers[0].id.toString());
    } catch (err) {
      const finalMessage = `Failed to get data.\n${
        err?.response?.data?.message || err?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
      console.error("Error fetching customers:", err);
    }
  };

  const handleCustomerDropdownChange = (value: string) => {
    setCustomerId(value);
  };

  const handlePrint = async () => {
    try {
      // const agingData = data;
      const customer = customers.find(
        (cust) => cust.id === parseInt(customerId, 10)
      );
      const customerName = customer.name;

      const agingData = data.map((row: any) => ({
        ...row,
        remaining_qty: Number(row.remaining_qty),
      }));
      // Build rows
      let totalKg: number = 0;

      const tableRows = agingData
        .map((item, i) => {
          const name = item.product_name || "-";
          const volume = item.remaining_qty;
          const qtyLeft = item.remaining_qty / item.conversion_to_kg;
          const qtyLeftString = `${qtyLeft.toLocaleString()} ${item.unit}`;
          const code = item.code || "";

          const dateStore = formatDateReport(item.created_at);
          totalKg += parseInt(volume, 10);

          return `
          <tr>
            <td class="number">${i + 1}</td>
            <td class="text">${name.toUpperCase()}</td>
            <td class="number">${dateStore}</td>
            <td class="text">${code}</td>
            <td class="number">${qtyLeftString}</td>
            <td class="number">${volume.toLocaleString()}</td>
          </tr>`;
        })
        .join("\n");

      const printWindow = window.open("", "_blank", "width=800,height=600");

      if (!printWindow) {
        alert("Popup blocked!");
        return;
      }

      const htmlContent = generateAgingHtml(customerName, tableRows, totalKg);

      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (err) {
      const finalMessage = `Failed to print.\n${
        err?.response?.data?.message || err?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");

      console.error("Error handle print:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const sortedStockReport = React.useMemo(() => {
    if (!data) return [];
    const processedData = data.map((item) => ({
      ...item,
      //   final_qty: item.product_in - item.product_out,
    }));

    return processedData.sort((a, b) => {
      // Sorting logic for each column
      switch (orderBy) {
        case "code":
          return order === "asc"
            ? a.code.localeCompare(b.code)
            : b.code.localeCompare(a.code);

        case "product_name":
          return order === "asc"
            ? a.product_name.localeCompare(b.product_name)
            : b.product_name.localeCompare(a.product_name);

        case "remaining_qty":
          return order === "asc"
            ? a.remaining_qty - b.remaining_qty
            : b.remaining_qty - a.remaining_qty;

        case "created_at":
          return order === "asc"
            ? new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime();

        default:
          return 0;
      }
    });
  }, [data, order, orderBy]);
  return (
    <>
      <PageLayout title="Report" items={["Aging Report"]}>
        <div className="container-fluid m-0 p-0">
          <div className="row">
            <div className="col-md-6 position-relative">
              <DropdownSecondStyle
                id="customer"
                label="Customer *"
                value={customerId}
                options={customers.map((customer) => ({
                  value: customer.id.toString(),
                  label: customer.name,
                }))}
                onChange={handleCustomerDropdownChange}
                icon={<FaUser />}
              />
            </div>
            <div className="col-md-6 position-relative d-flex justify-content-end align-items-start">
              <button
                className="btn btn-light btn-lg text-dark"
                onClick={handlePrint}
                aria-label="Print"
              >
                <FaPrint className="me-2" />
                Print
              </button>
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
                        <TableCell>{value.product_name}</TableCell>
                        <TableCell>
                          {new Date(value.created_at).toDateString()}
                        </TableCell>
                        <TableCell>{value.code}</TableCell>
                        <TableCell>
                          {Number(
                            value.remaining_qty / value.conversion_to_kg
                          ).toLocaleString("id-ID")}{" "}
                          {value.unit}
                        </TableCell>
                        <TableCell>
                          {Number(value.remaining_qty).toLocaleString("id-ID")}
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
