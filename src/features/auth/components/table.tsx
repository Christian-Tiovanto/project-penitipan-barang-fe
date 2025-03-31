import React, { useState } from "react";
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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

interface Column {
  field: string;
  headerName: string;
}

interface Props {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onAdd?: () => void;
}

const MuiTable: React.FC<Props> = ({
  columns,
  data,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = data.filter((row) =>
    columns.some((col) =>
      String(row[col.field]).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.field}>{row[col.field]}</TableCell>
                  ))}
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => onEdit && onEdit(row)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: "red" }}
                      onClick={() => onDelete && onDelete(row)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          sx={{ fontSize: "1.1rem" }}
          component="div"
          count={filteredData.length}
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
