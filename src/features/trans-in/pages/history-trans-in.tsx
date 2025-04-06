import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import { getAllProductsPagination } from "../../product/services/product.service";
import MuiTableTrans from "../../../components/table-mui-trans";
import { getAllTransInsPagination } from "../services/trans-in.service";
import MuiTableHistory from "../../../components/table-mui-history";

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
      console.log(id);
      const ProductId = parseInt(id, 10);
      setProductId(ProductId);
    }
  }, []);

  const fetchTableData = async (
    pageNo: number,
    PageSize: number,
    searchQuery: string
  ) => {
    try {
      if (productId === null) {
        throw new Error("Product ID belum tersedia");
      }

      const response = await getAllTransInsPagination(
        PageSize,
        pageNo,
        productId
      );

      return {
        data: response.data,
        total: response.meta.total_count,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { data: [], total: 0 };
    }
  };

  const handleEdit = (row: any) => {
    navigate(`/transaction/in/edit-in/${row.id}`);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb
          title="Transaction"
          items={["Transaction In", "History Transaction In"]}
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
