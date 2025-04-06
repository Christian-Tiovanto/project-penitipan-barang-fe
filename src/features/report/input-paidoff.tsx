import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { FaArrowRight } from "react-icons/fa6";
import { StartDatePicker } from "../../components/date-picker";
import InputNominal from "../../components/input-nominal";

interface AR {
  id: number;
  ar_date: Date;
  ar_no: string;
  customer: {
    id: number;
    name: string;
  };
  paid_payment: string[];
  total_bill: number;
  to_paid: number;
  created_at: Date;
}

const rows: AR[] = [
  {
    id: 1,
    ar_date: new Date(),
    ar_no: "FJ-030425-25683",
    paid_payment: ["CASH,CASH"],
    customer: { id: 1, name: "Customer Name" },
    total_bill: 162000,
    to_paid: 112000,
    created_at: new Date(),
  },
  {
    id: 2,
    ar_date: new Date(),
    ar_no: "FJ-030425-25683",
    paid_payment: ["CASH,CASH"],
    customer: { id: 1, name: "Customer Name" },
    total_bill: 162000,
    to_paid: 112000,
    created_at: new Date(),
  },
  {
    id: 3,
    ar_date: new Date(),
    ar_no: "FJ-030425-25683",
    paid_payment: ["CASH,CASH"],
    customer: { id: 1, name: "Customer Name" },
    total_bill: 162000,
    to_paid: 112000,
    created_at: new Date(),
  },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof AR;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "ar_date",
    numeric: false,
    disablePadding: false,
    label: "AR Date",
  },
  {
    id: "ar_no",
    numeric: false,
    disablePadding: false,
    label: "AR No",
  },
  {
    id: "customer",
    numeric: false,
    disablePadding: false,
    label: "Customer",
  },
  {
    id: "paid_payment",
    numeric: false,
    disablePadding: false,
    label: "Payment",
  },
  {
    id: "total_bill",
    numeric: false,
    disablePadding: false,
    label: "Total Bill",
  },
  {
    id: "to_paid",
    numeric: false,
    disablePadding: false,
    label: "To Paid",
  },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "created At",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof AR) => void;
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
    (property: keyof AR) => (event: React.MouseEvent<unknown>) => {
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
            // inputProps={{
            //   "aria-label": "select all desserts",
            // }}
          />
        </TableCell>
        {headCells.map((headCell) => (
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
      </TableRow>
    </TableHead>
  );
}
export default function InputPaidoffPage() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof AR>("ar_date");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [nominal, setNominal] = React.useState(0);

  const handleNominalChange = (event: any) => {
    const value = event.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setNominal(value);
    }
  };
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof AR
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
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
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        // .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="row mb-4">
          <div className="col-md-6 col-lg-4 position-relative mb-2">
            <StartDatePicker
              idDatePicker="tanggal-awal-masuk-barang"
              titleText="Tanggal Awal"
              datetime={false}
            />
          </div>
          <div className="col-md-6 col-lg-4 position-relative mb-2">
            <StartDatePicker
              idDatePicker="tanggal-akhir-masuk-barang"
              titleText="Tanggal Akhir"
              datetime={false}
            />
          </div>
          <div className="col-md-6 col-lg-4 position-relative mb-2">
            <StartDatePicker
              idDatePicker="tanggal-akhir-masuk-barang"
              titleText="Status"
              datetime={false}
            />
          </div>
          <div className="col-md-6 col-lg-4 position-relative mb-2">
            <StartDatePicker
              idDatePicker="tanggal-akhir-masuk-barang"
              titleText="Pick Customer"
              datetime={false}
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
                    rowCount={rows.length}
                  />
                  <TableBody>
                    {visibleRows.map((row, index) => {
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
                          sx={{ cursor: "pointer" }}
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
                            {row.ar_date.toDateString()}
                          </TableCell>
                          <TableCell align="left">{row.ar_no}</TableCell>
                          <TableCell align="left">
                            {row.customer.name}
                          </TableCell>
                          <TableCell align="left">{row.paid_payment}</TableCell>
                          <TableCell align="left">{row.total_bill}</TableCell>
                          <TableCell align="left">{row.to_paid}</TableCell>
                          <TableCell align="left">
                            {row.created_at.toDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-primary position-fixed rounded-0 dark-blue"
        data-bs-target="#paidoff-form"
        data-bs-toggle="modal"
        style={{
          bottom: "16px",
          right: "16px",
          fontSize: "16px",
          height: "44px",
          padding: "0 32px",
        }}
      >
        {` PELUNASAN ( 1 )`}
        <FaArrowRight className="ms-3" />
      </button>
      <div
        className="modal fade"
        id="paidoff-form"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex flex-wrap gap-2 justify-content-center">
              <span className="badge rounded-pill gray px-3 py-2 text-black">
                Total Item : 1
              </span>
              <span className="badge rounded-pill gray px-3 py-2 text-black">
                Total Piutang : 162.000.000
              </span>
              <span className="badge rounded-pill gray px-3 py-2 text-black">
                Customer : 1 asdfasdfasdfadsf
              </span>
            </div>
            <div className="modal-body d-flex flex-column gap-3">
              <div className="container-fluid p-0">
                <StartDatePicker
                  idDatePicker="tanggal-input-pelunasan"
                  titleText="Tanggal Lunas"
                  datetime={false}
                />
              </div>
              <InputNominal
                title="Total Paid"
                nominal={nominal}
                handleNominalChange={handleNominalChange}
              />
              <InputNominal
                title="Payment Type"
                nominal={nominal}
                handleNominalChange={handleNominalChange}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-close me-auto ms-4"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
