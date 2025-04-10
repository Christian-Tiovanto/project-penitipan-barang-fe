import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import { FaBox } from "react-icons/fa6";
import {
  EndDatePicker,
  StartDatePicker,
} from "../../../components/date-picker";
import { startOfToday, startOfTomorrow } from "date-fns";
import DropdownSecondStyle from "../../../components/dropdown-2";
import { Customer } from "../../customer-payment/pages/update-customer-payment";
import { getAllCustomers } from "../../customer/services/customer.service";
import { ArStatus } from "../../../enum/ArStatus";
import { useInvoiceList } from "../hooks/invoice-list.hooks";
import { MdLocalPrintshop } from "react-icons/md";
import { InvoiceListService } from "../services/invoice-list.service";

export interface Invoice {
  id: number;
  created_at: Date;
  invoice_no: string;
  customer: {
    id: number;
    name: string;
  };
  status: number;
  total_amount: number;
}

type Order = "asc" | "desc";
type TableData = Invoice & { invoice_date: string; cetak: string };
interface HeadCell {
  disablePadding: boolean;
  id: keyof TableData;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "AR Date",
  },
  {
    id: "invoice_no",
    numeric: false,
    disablePadding: false,
    label: "Invoice No",
  },
  {
    id: "customer",
    numeric: false,
    disablePadding: false,
    label: "Customer",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "total_amount",
    numeric: false,
    disablePadding: false,
    label: "Total Amount",
  },
  {
    id: "cetak",
    numeric: false,
    disablePadding: false,
    label: "Cetak",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof TableData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Checkbox
            className="p-0"
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.slice(0, headCells.length - 1).map((headCell) => (
          <TableCell
            className="fw-bold text-nowrap"
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell className="fw-bold text-nowrap">Cetak</TableCell>
      </TableRow>
    </TableHead>
  );
}
export default function InvoiceListPage() {
  const [customerId, setCustomerId] = React.useState<string>("");
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [status, setStatus] = React.useState<ArStatus>(ArStatus.PENDING);
  const [startDate, setStartDate] = React.useState(startOfToday());
  const [endDate, setEndDate] = React.useState(startOfTomorrow());
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof TableData>("created_at");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { response, isLoading } = useInvoiceList({
    startDate,
    endDate,
    customerId,
    order,
    sortBy: orderBy,
    pageNo: page,
    pageSize: rowsPerPage,
    status,
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = response.data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handlePrintSpb = async (invoiceId: number) => {
    const data = await new InvoiceListService().getSpb(invoiceId);
    console.log(data);
  };
  const handlePrintInvoice = async (invoiceId: number) => {
    const data = await new InvoiceListService().getTransOut(invoiceId);
    console.log(data);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
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
  const handleStatusDropdownChange = (value: string) => {
    setStatus(value as ArStatus);
  };
  const fetchCustomers = async () => {
    try {
      const customers = await getAllCustomers();
      setCustomers(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  React.useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="row mb-4">
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
              id="Status"
              label="Status *"
              value={status}
              options={[
                {
                  id: ArStatus.PENDING,
                  name: "Belum Lunas",
                },
                { id: ArStatus.COMPLETED, name: "Lunas" },
              ].map((customer) => ({
                value: customer.id.toString(),
                label: customer.name,
              }))}
              onChange={handleStatusDropdownChange}
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
      </div>
      <div className="w-100 d-flex flex-column">
        <div className="mui-table-container">
          <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={response?.data.length}
                  />
                  <TableBody>
                    {response.data.map((row, index) => {
                      const isItemSelected = selected.includes(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{
                            cursor: "pointer",
                            border: 1, // Add border to row
                            borderColor: "divider", // Use theme's divider color
                            "&:hover": {
                              borderColor: "primary.main", // Change border color on hover
                            },
                            // Remove cell borders
                            "& .MuiTableCell-root": {
                              border: "none",
                              "&:last-child": {
                                paddingRight: "16px", // Maintain padding
                              },
                            },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row">
                            {new Date(row.created_at).toDateString()}
                          </TableCell>
                          <TableCell align="left">{row.invoice_no}</TableCell>
                          <TableCell align="left">
                            {row.customer.name}
                          </TableCell>
                          <TableCell align="left">{row.status}</TableCell>
                          <TableCell align="left">
                            {Number(row.total_amount).toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell align="left">
                            <div className="btn-group" role="group">
                              <button
                                type="button"
                                className="btn btn-primary dropdown-toggle round-0 d-flex justify-content-center align-items-center gap-2"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <MdLocalPrintshop />
                                Cetak
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handlePrintSpb(row.id)}
                                  >
                                    Print SPB
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handlePrintInvoice(row.id)}
                                  >
                                    Print Invoice
                                  </button>
                                </li>
                              </ul>
                            </div>{" "}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={response.data.length > 0 ? response.meta.total_count : 0}
                rowsPerPage={
                  response.data.length > 0 ? response.meta.page_size : 5
                }
                page={response.data.length > 0 ? response.meta.page_no - 1 : 0}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </div>
      </div>
    </>
  );
}
