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
import {
  EnhancedTableProps,
  HeadCell,
} from "../../../components/table-component";
import { Order } from "../../../enum/SortOrder";
import DropdownSecondStyle from "../../../components/dropdown-2";
import { FaBox } from "react-icons/fa6";
import { Customer } from "../../customer-payment/pages/update-customer-payment";
import { getAllCustomers } from "../../customer/services/customer.service";
import { useArPaidReport } from "../hooks/ar-report-paid.hooks";
export interface IArReportPaidData {
  id: number;
  created_at: Date;
  ar_no: string;
  customer: {
    id: number;
    name: string;
  };
  total_bill: number;
  total_paid: number;
  to_paid: number;
}
const columns: HeadCell<IArReportPaidData & { row_no: number }>[] = [
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
    field: "total_paid",
    headerName: "Paid",
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

type TableData = IArReportPaidData & { row_no: number };
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
export function ArReportPaidPage() {
  const [customerId, setCustomerId] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState(startOfToday());
  const [endDate, setEndDate] = useState(startOfTomorrow());
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof TableData>("ar_no");

  const { data, isLoading } = useArPaidReport({
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
    setPage(newPage);
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
      <div className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-md-6 col-lg-4 position-relative mb-2">
            <StartDatePicker
              idDatePicker="tanggal-awal-masuk-barang"
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
              idDatePicker="tanggal-akhir-masuk-barang"
              titleText="Tanggal Akhir"
              datetime={false}
              value={endDate}
              onDateClick={(date: Date) => {
                setEndDate(date);
              }}
            />
          </div>
          <div className="col-md-6 col-lg-4 position-relative mb-2">
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
                  {data ? (
                    <>
                      {data.map((value, index) => (
                        <TableRow key={value.id}>
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
                            {Number(value.total_paid).toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell>
                            {Number(value.to_paid).toLocaleString("id-ID")}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3}></TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {Number(10000).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {Number(10000).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {Number(10000).toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <h1>tes</h1>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                sx={{ fontSize: "1.1rem" }}
                component="div"
                count={data.length}
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
