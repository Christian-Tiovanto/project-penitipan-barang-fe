import React from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import { getAllProductsPagination } from "../../product/services/product.service";
import MuiTableTrans from "../../../components/table-mui-trans";
import { getAllTransInHeaderPagination } from "../services/trans-in.service";

interface FetchFilters {
  sort?: string;
  order?: "asc" | "desc";
  [key: string]: any;
}

const TransInPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "code", headerName: "No Trans In" },
    { field: "transaction_in[0].is_charge", headerName: "Charge" },
    { field: "created_at", headerName: "Date" },
  ];

  const fetchTableData = async (
    pageNo: number,
    pageSize: number,
    searchQuery: string,
    filters?: FetchFilters
  ): Promise<{ data: any[]; total: number }> => {
    try {
      const response = await getAllTransInHeaderPagination({
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
    } catch (err) {
      const finalMessage = `Failed to get data.\n${
        err?.response?.data?.message || err?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");

      console.error("Error fetching table data:", err);
      return { data: [], total: 0 };
    }
  };

  const handleHistory = (row: any) => {
    navigate(`/transaction/in/history-in/${row.id}`);
  };

  const handleAdd = () => {
    navigate(`/transaction/in/create-in`);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb title="Transaction" items={["Transaction In"]} />
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
        <MuiTableTrans
          columns={columns}
          fetchData={fetchTableData}
          onAdd={handleAdd}
          onHistory={handleHistory}
          // onAdd={handleAdd}
        />
      </div>
    </div>
  );
};

export default TransInPage;
