import React from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import MuiTable from "../../../components/table-mui";
import { useToast } from "../../../contexts/toastContexts";
import {
  deleteProductUnitById,
  getAllProductUnits,
} from "../services/product-unit.service";

interface FetchFilters {
  sort?: string;
  order?: "asc" | "desc";
  [key: string]: any;
}

const ProductUnitPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "product.name", headerName: "Product Name" },
    { field: "conversion_to_kg", headerName: "Conversion To KG" },
  ];

  const fetchTableData = async (
    pageNo: number,
    pageSize: number,
    searchQuery: string,
    filters?: FetchFilters
  ): Promise<{ data: any[]; total: number }> => {
    try {
      const response = await getAllProductUnits({
        pageNo: pageNo + 1, // backend biasanya 1-based
        pageSize,
        search: searchQuery,
        sort: filters?.sort,
        order: filters?.order,
      });

      return {
        data: response.data,
        total: response.meta.total_count,
      };
    } catch (error) {
      const finalMessage = `Failed to get data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");

      console.error("Error fetching table data:", error);
      return { data: [], total: 0 };
    }
  };
  const handleEdit = (row: any) => {
    navigate(`/master/product-unit/edit-product-unit/${row.id}`);
  };

  const handleDelete = async (row: any) => {
    try {
      await deleteProductUnitById(row.id);
      showToast("Data deleted successfully!", "success");
    } catch (error: any) {
      const finalMessage = `Failed to delete data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
    }
  };

  const handleAdd = () => {
    navigate("/master/product-unit/create-product-unit");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb title="Master" items={["Product Unit"]} />
        <button
          type="button"
          className="btn btn-outline-secondary px-4"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>
      </div>

      <div className="card shadow-lg border-0 rounded-4 p-4">
        <MuiTable
          columns={columns}
          fetchData={fetchTableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>
    </div>
  );
};

export default ProductUnitPage;
