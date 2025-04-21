import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Box,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  TableSortLabel,
} from "@mui/material";
import {
  History as HistoryIcon,
  Print as PrintIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { TransactionInHeader } from "../features/trans-out/pages/create-trans-out";
import { getTransInHeaderById } from "../features/trans-in/services/trans-in.service";
import { generateTransInHtml } from "../features/template/trans-in.template";

interface Column {
  field: string;
  headerName: string;
}

interface FetchFilters {
  [key: string]: any;
}

interface Props {
  columns: Column[];
  fetchData: (
    page: number,
    rowsPerPage: number,
    searchQuery: string,
    filters?: FetchFilters
  ) => Promise<{ data: any[]; total: number }>;
  onHistory?: (row: any) => void;
  // onPrint?: (row: any) => void;
  onAdd?: () => void;
  filters?: FetchFilters;
}

const MuiTable: React.FC<Props> = ({
  columns,
  fetchData,
  onHistory,
  // onPrint,
  onAdd,
  filters = {},
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchData(page, rowsPerPage, searchQuery, {
        ...filters,
        sort: sortField ?? undefined,
        order: sortField ? sortOrder : undefined,
      });
      setData(result.data);
      setTotalRows(result.total);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, searchQuery, sortField, sortOrder]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePrint = async (row: any) => {
    try {
      const transInHeader = await getTransInHeaderById(row.id);

      const items = transInHeader.transaction_in;

      const date = new Date(transInHeader.created_at);

      // Format jam
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const time = `${hours}:${minutes}`;

      // Format tanggal (D/M/Y)
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 0-based index
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      // Build rows
      let totalQty = 0;
      let totalKg = 0;

      const tableRows = items
        .map((item, i) => {
          const name = item.product.name || "-";
          const volume = item.converted_qty;
          totalQty += item.qty;
          totalKg += volume;

          return `
            <tr>
              <td class="number">${i + 1}</td>
              <td class="text">${name.toUpperCase()}</td>
              <td class="number">${item.qty}</td>
              <td class="text">${item.unit}</td>
              <td class="number">${volume.toLocaleString()}</td>
            </tr>`;
        })
        .join("\n");

      const printWindow = window.open("", "_blank", "width=800,height=600");

      if (!printWindow) {
        alert("Popup blocked!");
        return;
      }

      const htmlContent = generateTransInHtml(
        transInHeader,
        formattedDate,
        time,
        tableRows,
        totalQty,
        totalKg
      );

      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (error) {
      console.error("Failed to Print data:", error);
    }
  };

  const handleSort = (field: string) => {
    const fieldMapping: Record<string, string> = {
      "customer.name": "customer",
      "product.name": "product",
      "payment_method.name": "payment_method",
      // tambahkan mapping lainnya kalau ada
    };

    if (sortField === fieldMapping[field] || sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(fieldMapping[field] || field);
      setSortOrder("asc");
    }
    setPage(0);
  };

  return (
    <div className="mui-table-container">
      <TableContainer component={Paper} sx={{ padding: 2 }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{
              textTransform: "none",
              fontSize: "0.9rem",
              padding: "8px 16px",
              mb: { xs: 2, sm: 0 },
            }}
          >
            Add New
          </Button>
          <TextField
            label="Search..."
            variant="standard"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: "100%", sm: "300px" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    sortDirection={sortField === col.field ? sortOrder : false}
                  >
                    <TableSortLabel
                      active={sortField === col.field}
                      direction={sortField === col.field ? sortOrder : "asc"}
                      onClick={() => handleSort(col.field)}
                    >
                      <b>{col.headerName}</b>
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => {
                    const value = col.field
                      .split(".")
                      .reduce((acc, part) => acc && acc[part], row);
                    return (
                      <TableCell key={col.field}>
                        {typeof value === "boolean"
                          ? value
                            ? "Active"
                            : "Inactive"
                          : value}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => onHistory && onHistory(row)}
                    >
                      <HistoryIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: "green" }}
                      onClick={() => handlePrint(row)}
                    >
                      <PrintIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <TablePagination
          sx={{ fontSize: "1.1rem" }}
          component="div"
          count={totalRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </div>
  );
};

export default MuiTable;
