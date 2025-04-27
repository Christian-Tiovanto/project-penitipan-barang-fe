import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import { getAllProductsPagination } from "../../product/services/product.service";
import MuiTableTrans from "../../../components/table-mui-trans";
import { getAllTransInsPaginationByHeaderId } from "../services/trans-in.service";
import MuiTableHistory from "../../../components/table-mui-history";
import { getUserByIdToken } from "../../auth/services/auth.service";

interface FetchFilters {
  sort?: string;
  order?: "asc" | "desc";
  [key: string]: any;
}

const TransInHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [productId, setProductId] = useState<number | null>(null);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "customer.name", headerName: "Customer" },
    { field: "product.name", headerName: "Product" },
    { field: "qty", headerName: "Qty" },
    { field: "unit", headerName: "Unit" },
    { field: "created_at", headerName: "Date In" },
  ];

  useEffect(() => {
    if (id) {
      const ProductId = parseInt(id, 10);
      setProductId(ProductId);
    }
  }, []);

  const fetchTableData = async (
    pageNo: number,
    pageSize: number,
    searchQuery: string,
    filters?: FetchFilters
  ): Promise<{ data: any[]; total: number }> => {
    try {
      if (productId === null) {
        throw new Error("Product ID belum tersedia");
      }

      const response = await getAllTransInsPaginationByHeaderId(productId, {
        pageNo: pageNo + 1, // backend biasanya 1-based
        pageSize,
        search: searchQuery,
        sort: filters?.sort,
        order: filters?.order,
      });
      for (let i = 0; i < response.data.length; i++) {
        response.data[i].created_at = new Date(
          response.data[i].created_at
        ).toLocaleString("en-GB");
      }
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
    setTimeout(() => {
      navigate(`/transaction/in/edit-in/${row.id}`);
    }, 100);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb
          title="Transaction"
          items={["Transaction In", "Detail Transaction In"]}
        />
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
        {productId !== null && (
          <MuiTableHistory
            columns={columns}
            fetchData={fetchTableData}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
};

export default TransInHistoryPage;
