import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import { getAllProductsPagination } from "../../product/services/product.service";
import MuiTableTrans from "../../../components/table-mui-trans";
import { getAllTransInsPaginationByProductId } from "../services/trans-in.service";
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
  const [transInId, setTransInId] = useState<number | null>(null);

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");

  const handleCheckPin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 🔥 cegah reload form
    try {
      if (pin.trim()) {
        const user = await getUserByIdToken();
        if (user.pin === pin) {
          showToast("Pin validated successfully!", "success");
          setIsPinModalOpen(false);

          // 💡 Beri delay jika perlu menunggu modal tutup
          setTimeout(() => {
            navigate(`/transaction/in/edit-in/${transInId}`);
          }, 100);
        } else {
          setIsPinModalOpen(false);
          showToast("Pin validated failed!", "danger");
        }
      }
    } catch (error: any) {
      const finalMessage = `Failed to validate pin.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
    }
  };

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

      const response = await getAllTransInsPaginationByProductId(productId, {
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
    setIsPinModalOpen(true);
    setTransInId(row.id);
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

        {/* Modal PIN */}
        {isPinModalOpen && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ width: "250px" }} // Atur lebar modal di sini
            >
              <div className="modal-content border-0 rounded-3 shadow-sm">
                <div className="modal-header border-0 pb-2">
                  {/* <h6 className="modal-title">Masukkan PIN</h6> */}
                  {/* <button
                    type="button"
                    className="btn-close"
                    onClick={() => setIsPinModalOpen(false)}
                  ></button> */}
                </div>

                <form onSubmit={handleCheckPin}>
                  <div className="modal-body pt-0">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter PIN *"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="modal-footer border-0 pt-1">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsPinModalOpen(false)}
                    >
                      Tutup
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Check
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransInHistoryPage;
