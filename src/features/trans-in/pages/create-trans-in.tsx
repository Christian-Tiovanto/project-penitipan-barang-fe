import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import { FaBox, FaClipboardUser, FaTruck } from "react-icons/fa6";
import Dropdown from "../../../components/dropdown";
import { getAllCustomers } from "../../customer/services/customer.service";
import { getAllProducts } from "../../product/services/product.service";
import InputField from "../../../components/inputfield";
import ProductCard from "../../../components/product-card";
import ProductCardDropDown from "../../../components/product-card-dropdown";
import { createTransIn } from "../services/trans-in.service";
import RadioToggle from "../../../components/radio-toggle";

export interface ProductUnit {
  id: number;
  productId: number;
  name: string;
  conversion_to_kg: number;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  qty: number;
  desc: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  product_unit: ProductUnit[];
}

interface Customer {
  id: number;
  name: string;
  code: string;
  address: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

const CreateTransForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal
  const [modalData, setModalData] = useState<{
    products: Product[];
  } | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [form, setForm] = useState({
    customerId: "",
    isCharge: false,
  });

  const [errors, setErrors] = useState({
    customerId: "",
    isCharge: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  useEffect(() => {
    const defaultUnits: Record<string, number> = {};
    products.forEach((product) => {
      if (product.product_unit?.length) {
        defaultUnits[product.id] = product.product_unit[0].id;
      }
    });
    setSelectedUnits(defaultUnits);
  }, [products]);

  const fetchProducts = async () => {
    try {
      const products = await getAllProducts();
      const updated = products.map((p: any) => ({ ...p, qty: 0 }));
      setProducts(updated);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const customers = await getAllCustomers();
      setCustomers(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.customerId) {
      newErrors.customerId = "Please Select a Customer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDropdownCustomerChange = (value: string) => {
    setForm({ ...form, customerId: value });
  };

  const updateQty = (id: number, qty: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  };

  const handleCreateTransInPage = async () => {
    try {
      const payload = {
        customerId: form.customerId, // ganti sesuai dengan variabel customer ID yang kamu pakai
        data: products
          .filter((p) => p.qty > 0 && selectedUnits[p.id] !== undefined)
          .map((p) => ({
            productId: p.id,
            qty: p.qty, // ubah dari converted_qty ke qty
            unitId: selectedUnits[p.id],
            is_charge: form.isCharge,
          })),
      };

      await createTransIn(payload);

      navigate("/transaction/in");
      showToast("Data added successfully!", "success");
    } catch (error: any) {
      const finalMessage = `Failed to add data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (validateForm()) {
        const productModal = products.filter(
          (p) => p.qty > 0 && selectedUnits[p.id] !== undefined
        );

        setModalData(() => ({
          products: productModal,
        }));

        openModal();
      }
    } catch (error: any) {
      const finalMessage = `Failed to add data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
    }
  };

  const [selectedUnits, setSelectedUnits] = useState<{
    [productId: number]: number;
  }>({});

  const handleUnitChange = (productId: number, unitId: number) => {
    setSelectedUnits((prev) => ({
      ...prev,
      [productId]: unitId,
    }));
  };

  const handleIsChargeChange = (value: boolean) => {
    setForm({ ...form, isCharge: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Dropdown
        label="Customer *"
        value={String(form.customerId)}
        options={customers.map((customer) => ({
          value: customer.id.toString(),
          label: customer.name,
        }))}
        onChange={handleDropdownCustomerChange}
        error={!!errors.customerId}
        errorMessage={errors.customerId}
        icon={<FaClipboardUser />}
      />

      <RadioToggle
        label="Charge *"
        name="is_charge"
        isActive={form.isCharge}
        onChange={handleIsChargeChange}
        error={false}
      />

      <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-md border border-gray-200">
        {/* Search Field */}
        <div className="mb-3">
          <InputField
            label="Product List "
            type="text"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FaSearch />}
          />
        </div>

        {/* Product List Container */}
        <div
          className="container flex flex-wrap overflow-y-auto space-y-3 bg-gray-50 border border-gray-300 rounded-lg p-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
          style={{ maxHeight: "250px" }}
        >
          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="col-12 col-md-6">
                  <ProductCardDropDown
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    qty={product.qty}
                    product_unit={product.product_unit} // Menyertakan unit produk
                    onQtyChange={(qty) => updateQty(product.id, qty)}
                    onUnitChange={(productId, unitId) =>
                      handleUnitChange(productId, unitId)
                    } // Menangani perubahan unit
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">Product not found.</p>
              </div>
            )}
          </div>
        </div>
        {/* Modal */}
        {isModalOpen && modalData && (
          <div
            className="modal fade show d-flex align-items-center justify-content-center"
            id="paidoff-form"
            tabIndex={-1}
            aria-labelledby="paidoffFormLabel"
            aria-hidden="false"
            style={{
              display: "block",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="paidoffFormLabel">
                    Transaction In Detail
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalData.products.map((product, index) => (
                        <tr key={index}>
                          <td>{product.name}</td>
                          <td>{product.qty}</td>
                          <td>
                            {product.product_unit?.find(
                              (unit) => unit.id === selectedUnits[product.id]
                            )?.name || "No Unit Available"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCreateTransInPage}
                  >
                    Create Trans In
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-end mt-3">
        <button type="submit" className="btn btn-primary px-4">
          Save <FaSave className="ms-2" />
        </button>
      </div>
    </form>
  );
};

const CreateTransInPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb
          title="Transaction"
          items={["Transaction In", "Create Transaction In"]}
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
        <CreateTransForm />
      </div>
    </div>
  );
};

export default CreateTransInPage;
