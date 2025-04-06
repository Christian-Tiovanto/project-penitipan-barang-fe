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
  // Button,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon, Search as SearchIcon } from "@mui/icons-material";
import { FaDolly } from "react-icons/fa6";

interface Column {
  field: string;
  headerName: string;
}

interface Props {
  columns: Column[];
  fetchData: (
    page: number,
    rowsPerPage: number,
    searchQuery: string
  ) => Promise<{ data: any[]; total: number }>;
  //   onAdd?: (row: any) => void;
  onEdit?: (row: any) => void;
  // onAdd?: () => void;
}

const MuiTableHistory: React.FC<Props> = ({ columns, fetchData, onEdit }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchData(page, rowsPerPage, searchQuery);
      setData(result.data);
      setTotalRows(result.total);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, searchQuery]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = async (row: any) => {
    try {
      if (onEdit) {
        await onEdit(row);
      }

      loadData();
    } catch (error) {
      console.error("Failed to Edit data:", error);
    }
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
          <h4 className="p-3 mb-3 mb-0">
            {data[0]?.product?.name ?? "Tidak ada nama"}
          </h4>

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
                  <TableCell key={col.field}>
                    <b>{col.headerName}</b>
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
                    // console.log(value);
                    // return <TableCell key={col.field}>{value}</TableCell>;

                    // const value = row[col.field];
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
                      sx={{ color: "green" }}
                      onClick={() => handleEdit(row)}
                    >
                      <EditIcon />
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

export default MuiTableHistory;
