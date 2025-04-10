import React from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import MuiTable from "../../../components/table-mui";
import { useToast } from "../../../contexts/toastContexts";
import {
  deleteCustomerPaymentById,
  getAllCustomerPayments,
} from "../services/customer-payment.service";
// import { deleteProductUnitById, getAllProductUnits } from "../services/customer-payment.service";

interface FetchFilters {
  sort?: string;
  order?: "asc" | "desc";
  [key: string]: any;
}

const CustomerPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "customer.name", headerName: "Customer" },
    { field: "payment_method.name", headerName: "Payment Method" },
    { field: "charge", headerName: "Charge" },
    { field: "status", headerName: "Status" },
    { field: "min_pay", headerName: "Min Pay" },
  ];

  const fetchTableData = async (
    pageNo: number,
    pageSize: number,
    searchQuery: string,
    filters?: FetchFilters
  ): Promise<{ data: any[]; total: number }> => {
    try {
      const response = await getAllCustomerPayments({
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
      console.error("Error fetching table data:", error);
      return { data: [], total: 0 };
    }
  };

  const handleEdit = (row: any) => {
    navigate(`/master/customer-payment/edit-customer-payment/${row.id}`);
  };

  const handleDelete = async (row: any) => {
    try {
      await deleteCustomerPaymentById(row.id);
      showToast("Data deleted successfully!", "success");
    } catch (error: any) {
      const finalMessage = `Failed to delete data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
    }
  };

  const handleAdd = () => {
    navigate("/master/customer-payment/create-customer-payment");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb title="Master" items={["Customer Payment"]} />
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

export default CustomerPaymentPage;
