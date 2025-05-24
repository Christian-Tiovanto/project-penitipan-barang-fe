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
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { startOfToday, startOfTomorrow } from "date-fns";
import DropdownSecondStyle from "../../../components/dropdown-2";
import { Customer } from "../../customer-payment/pages/update-customer-payment";
import { getAllCustomers } from "../../customer/services/customer.service";
import {
  EnhancedTableProps,
  HeadCell,
} from "../../../components/table-component";
import { FaBox, FaPrint } from "react-icons/fa6";
import { Order } from "../../../enum/SortOrder";
import { useArMixedReport } from "../hooks/ar-mixed-report.hooks";
import PageLayout from "../../../components/page-location";
import { formatDateReport } from "../../../utils/date";
// import { generateMixedHtml } from "../../template/Mixed.template";
import { useToast } from "../../../contexts/toastContexts";
import { generateArMixedHtml } from "../../template/ar-mixed.template";
export interface IArMixedData {
  id: number;
  created_at: Date;
  ar_no: string;
  customer: {
    id: number;
    name: string;
  };
  total_bill: number;
  to_paid: number;
}
const columns: HeadCell<IArMixedData & { row_no: number }>[] = [
  {
    field: "row_no",
    headerName: "No",
    headerStyle: {
      width: "1%",
    },
  },
  {
    field: "created_at",
    headerName: "Invoice Date",
    headerStyle: {
      width: "10%",
    },
  },
  {
    field: "ar_no",
    headerName: "Invoice No",
    headerStyle: {
      width: "10%",
    },
  },
  {
    field: "customer",
    headerName: "Customer",
    headerStyle: {
      width: "10%",
    },
  },
  {
    field: "total_bill",
    headerName: "Total Bill",
    headerStyle: {
      width: "10%",
    },
  },
  {
    field: "to_paid",
    headerName: "To Paid",
    headerStyle: {
      width: "10%",
    },
  },
];
type TableData = IArMixedData & { row_no: number };
function EnhancedTableHead(props: EnhancedTableProps<TableData>) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof TableData) => (event: React.MouseEvent<unknown>) => {
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
export function ArMixedPage() {
  const [customerId, setCustomerId] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [startDate, setStartDate] = useState(startOfToday());
  const [endDate, setEndDate] = useState(startOfTomorrow());
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof TableData>("ar_no");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { showToast } = useToast();

  const { response, isLoading } = useArMixedReport({
    startDate,
    endDate,
    customerId,
    order,
    sortBy: orderBy,
    pageNo: page,
    pageSize: rowsPerPage,
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handlePrint = async () => {
    try {
      // if (!customerId || customerId.trim() === "") {
      //   throw new Error("Customer ID Has not been selected");
      // }
      // const customer = customers.find(
      //   (cust) => cust.id === parseInt(customerId, 10)
      // );

      // const customerName = customer.name;
      formatDateReport;
      const MixedData = response.data;
      // Build rows
      let invoiceTotalBill = 0;
      let invoiceTotalMixed = 0;

      const tableRows = MixedData.map((item, i) => {
        const invoiceNo = item.ar_no || "-";
        const customerName = item.customer.name;
        const totalBill = item.total_bill;
        const toPaid = item.to_paid;
        const invoiceDate = formatDateReport(item.created_at);

        invoiceTotalBill += totalBill;
        invoiceTotalMixed += toPaid;

        const style =
          toPaid === 0
            ? "background-color: #ffcdd2;"
            : "background-color: #888;";

        return `
        <tr style="${style}">
        <td class="number">${i + 1}</td>
        <td class="text">${invoiceDate}</td>
        <td class="text">${invoiceNo}</td>
        <td class="text">${customerName.toUpperCase()}</td>
        <td class="number">${totalBill.toLocaleString()}</td>
        <td class="number">${toPaid.toLocaleString()}</td>
        </tr>`;
      }).join("\n");

      const printWindow = window.open("", "_blank", "width=800,height=600");

      if (!printWindow) {
        alert("Popup blocked!");
        return;
      }

      const htmlContent = generateArMixedHtml(
        startDate,
        endDate,
        tableRows,
        invoiceTotalBill,
        invoiceTotalMixed
      );

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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCustomerDropdownChange = (value: string) => {
    setCustomerId(value);
  };
  const fetchCustomers = async () => {
    try {
      const customers = await getAllCustomers();
      setCustomers(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <PageLayout title="Report" items={["Ar Mixed"]}>
        <div className="container-fluid m-0 p-0">
          <div className="row">
            <div className="col-md-6 col-lg-4 position-relative">
              <StartDatePicker
                idDatePicker="tanggal-awal"
                titleText="Start Date"
                datetime={false}
                value={startDate}
                onDateClick={(date: Date) => {
                  setStartDate(date);
                }}
              />
            </div>
            <div className="col-md-6 col-lg-4 position-relative">
              <EndDatePicker
                idDatePicker="tanggal-akhir"
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
            <div className="col-md-6 col-lg-4 position-relative mb-3">
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
                    {!isLoading && response.data ? (
                      <>
                        {response.data.map((value, index) => (
                          <TableRow
                            key={value.id}
                            className={`${
                              value.to_paid === 0
                                ? "red-lighten"
                                : "black-lighten"
                            }`}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {new Date(value.created_at).toLocaleDateString(
                                "en-GB"
                              )}
                            </TableCell>
                            <TableCell>{value.ar_no}</TableCell>
                            <TableCell>{value.customer.name}</TableCell>
                            <TableCell>
                              {Number(value.total_bill).toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell>
                              {Number(value.to_paid).toLocaleString("id-ID")}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3}></TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Total
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {Number(
                              response.data.reduce(
                                (sum, ar) => sum + ar.total_bill,
                                0
                              )
                            ).toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {Number(
                              response.data.reduce(
                                (sum, ar) => sum + ar.to_paid,
                                0
                              )
                            ).toLocaleString("id-ID")}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6}>
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
