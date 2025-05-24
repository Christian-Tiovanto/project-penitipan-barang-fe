import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import {
  FaSave,
  FaArrowLeft,
  FaSearch,
  FaCalendarAlt,
  FaArrowCircleDown,
  FaExchangeAlt,
  FaStream,
  FaStickyNote,
  FaFileAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import {
  FaBox,
  FaClipboardUser,
  FaListOl,
  FaTag,
  FaTruck,
} from "react-icons/fa6";
import Dropdown from "../../../components/dropdown";
import { getAllCustomers } from "../../customer/services/customer.service";
import { getAllProducts } from "../../product/services/product.service";
import InputField from "../../../components/inputfield";
import ProductCard from "../../../components/product-card";
import {
  createTransOut,
  createTransOutFifo,
  previewTransOut,
  previewTransOutFifo,
} from "../services/trans-out.service";
import { StartDatePicker } from "../../../components/date-picker";
import DatePickerField from "../../../components/date-picker-field";
import {
  getAllTransInHeaderByCustomerId,
  getTransInById,
  getTransInHeaderById,
} from "../../trans-in/services/trans-in.service";
import RadioToggle from "../../../components/radio-toggle";
import { formatLocalDate } from "../../../utils/date";
import InputFieldNumber from "../../../components/inputfieldnumber";
import { FormatListNumbered, NorthWestRounded } from "@mui/icons-material";

interface Product {
  id: number;
  name: string;
  price: number;
  qty: number;
  desc: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface TransactionInHeader {
  id: number;
  code: string;
  customer: Customer;
  customerId: number;
  created_at: Date;
  updated_at: Date;
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

enum InvoiceStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

interface Invoice {
  customerId: number;
  invoice_no: string;
  total_amount: number;
  charge: number;
  fine: number;
  discount: number;
  total_order: number;
  total_order_a: number;
  tax: number;
  status: InvoiceStatus;
}

const CreateTransOutForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transInHeaders, setTransInHeaders] = useState<TransactionInHeader[]>(
    []
  );

  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal
  const [modalData, setModalData] = useState<{
    products: Product[];
    invoice: Invoice;
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
    no_plat: "",
    transInHeaderId: "",
    type: "fifo",
    isCharge: false,
    product_name: "",
    product_qty: 0,
    product_price: 0,
    product_total_price: 0,
    brgLuar: false,
    spbDesc: "",
  });

  const [errors, setErrors] = useState({
    customerId: "",
    no_plat: "",
    transInHeaderId: "",
    type: "",
    isCharge: "",
    product_name: "",
    product_qty: "",
    product_price: "",
    product_total_price: "",
    spbDesc: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // fetchProducts();
    fetchCustomers();
    fetchAllProducts();
  }, []);

  const fetchProducts = async (transInHeaderId: number) => {
    try {
      const transInHeader = await getTransInHeaderById(transInHeaderId);

      if (!transInHeader || !Array.isArray(transInHeader.transaction_in)) {
        console.warn("Data transaction_in tidak tersedia atau bukan array.");
        return;
      }

      const uniqueProductsMap = new Map<number, any>();

      transInHeader.transaction_in.forEach((item: any) => {
        const product = item.product;
        if (product && !uniqueProductsMap.has(product.id)) {
          const {
            id,
            name,
            price,
            qty,
            desc,
            initial_qty,
            is_deleted,
            created_at,
            updated_at,
          } = product;
          uniqueProductsMap.set(product.id, {
            id,
            name,
            price,
            qty,
            desc,
            initial_qty,
            is_deleted,
            created_at,
            updated_at,
          });
        }
      });

      const products = Array.from(uniqueProductsMap.values());
      // const products = await getAllProducts();
      const updated = products.map((p: any) => ({ ...p, qty: 0 }));
      setProducts(updated);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const products = await getAllProducts();

      const updated = products.map((p: any) => ({ ...p, qty: 0 }));
      setProducts(updated);
    } catch (error) {
      console.error("Error fetching products:", error);
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

  const fetchTransInHeaders = async (customerId: number) => {
    try {
      const transInHeaders = await getAllTransInHeaderByCustomerId(customerId);
      setTransInHeaders(transInHeaders);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    // if (!form.productId) {
    //   newErrors.productId = "Please Select a Product";
    // }

    if (!form.customerId) {
      newErrors.customerId = "Please Select a Customer";
    }

    if (!form.type) {
      newErrors.type = "Please Select a Type";
    }

    if (!form.transInHeaderId && form.type != "fifo") {
      newErrors.transInHeaderId = "Please Select a Transaction In";
    }

    if (!form.product_name && form.brgLuar != false) {
      newErrors.product_name = "This field is required";
    }

    if (form.product_qty < 1 && form.brgLuar != false) {
      newErrors.product_qty = "Qty must be greater than 0";
    }

    if (!form.no_plat.trim()) {
      newErrors.no_plat = "This field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDropdownCustomerChange = (value: string) => {
    setForm({ ...form, customerId: value });

    fetchTransInHeaders(parseInt(value));
  };

  const handleDropdownTransInHeaderChange = (value: string) => {
    setForm({ ...form, transInHeaderId: value });

    fetchProducts(parseInt(value));
  };

  const handleDropdownTypeChange = (value: string) => {
    if (value == "fifo") {
      fetchAllProducts();
      setForm({ ...form, type: value });
    } else {
      setProducts([]);
      setForm({ ...form, type: value, transInHeaderId: "" });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !value.trim() ? "This field is required" : "",
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const updateQty = (id: number, qty: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  };

  const handleIsChargeChange = (value: boolean) => {
    setForm({ ...form, isCharge: value });
  };

  const handleBrgLuarChange = (value: boolean) => {
    setForm({ ...form, brgLuar: value });
  };

  const handlePriceChange = (newValue: number) => {
    const totalPrice = form.product_qty * newValue;
    setForm({
      ...form,
      product_price: newValue,
      product_total_price: totalPrice,
    });
  };

  const handleQtyChange = (newValue: number) => {
    const totalPrice = form.product_price * newValue;
    setForm({
      ...form,
      product_qty: newValue,
      product_total_price: totalPrice,
    });
  };

  const handleCreateInvoice = async () => {
    try {
      const payload = products
        .filter((p) => p.qty > 0)
        .map((p) => ({
          productId: p.id,
          qty: p.qty,
          productName: p.name,
          is_charge: form.isCharge,
        }));
      let payloadBrgLuar = [];
      if (form.brgLuar == true) {
        payloadBrgLuar = [
          {
            productId: null,
            qty: 0,
            productName: form.product_name,
            is_charge: false,
            price: form.product_price,
            total_price: form.product_total_price,
            converted_qty: form.product_qty,
          },
        ];
      }

      const clockOut = selectedDate ? formatLocalDate(selectedDate) : "";

      if (form.type == "fifo") {
        await createTransOutFifo(
          parseInt(form.customerId, 10),
          form.no_plat,
          clockOut,
          payload,
          payloadBrgLuar,
          clockOut
          // form.spbDesc
        );
      } else {
        await createTransOut(
          parseInt(form.customerId, 10),
          form.no_plat,
          clockOut,
          payload,
          payloadBrgLuar,
          parseInt(form.transInHeaderId, 10),
          clockOut
          // form.spbDesc
        );
      }

      navigate("/transaction");
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
        const payload = products
          .filter((p) => p.qty > 0)
          .map((p) => ({
            productId: p.id,
            qty: p.qty,
            productName: p.name,
            is_charge: form.isCharge,
          }));

        let payloadBrgLuar = [];
        if (form.brgLuar == true) {
          payloadBrgLuar = [
            {
              productId: null,
              qty: 0,
              productName: form.product_name,
              is_charge: false,
              price: form.product_price,
              total_price: form.product_total_price,
              converted_qty: form.product_qty,
            },
          ];
        }

        const clockOut = selectedDate ? formatLocalDate(selectedDate) : "";

        if (form.type == "fifo") {
          const invoice = await previewTransOutFifo(
            parseInt(form.customerId, 10),
            form.no_plat,
            clockOut,
            payload,
            payloadBrgLuar,
            clockOut
          );

          const productModal = [...products.filter((p) => p.qty > 0)];

          setModalData(() => ({
            products: productModal,
            invoice: invoice,
          }));
          openModal();
        } else {
          const invoice = await previewTransOut(
            parseInt(form.customerId, 10),
            form.no_plat,
            clockOut,
            payload,
            payloadBrgLuar,
            parseInt(form.transInHeaderId, 10),
            clockOut
          );

          const productModal = products.filter((p) => p.qty > 0);

          setModalData(() => ({
            products: productModal,
            invoice: invoice,
          }));
          openModal();
        }
      }
    } catch (error: any) {
      const finalMessage = `Failed to add data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
    }
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

      <div className="row g-3">
        <div className="col-md-6">
          <Dropdown
            label="Type *"
            value={String(form.type)}
            options={[
              { value: "fifo", label: "Fifo" },
              { value: "noTransIn", label: "No Transaction In" },
            ]}
            onChange={handleDropdownTypeChange}
            error={!!errors.type}
            errorMessage={errors.type}
            icon={<FaStream />}
          />
        </div>
        <div className="col-md-6">
          <RadioToggle
            label="Charge *"
            name="is_charge"
            isActive={form.isCharge}
            onChange={handleIsChargeChange}
            error={false}
          />
        </div>
      </div>
      {form.type !== "fifo" && (
        <Dropdown
          label="No Trans In *"
          value={String(form.transInHeaderId)}
          options={transInHeaders.map((transInHeader) => ({
            value: transInHeader.id.toString(),
            label: transInHeader.code,
          }))}
          onChange={handleDropdownTransInHeaderChange}
          error={!!errors.transInHeaderId}
          errorMessage={errors.transInHeaderId}
          icon={<FaArrowCircleDown />}
        />
      )}

      <div className="row g-3">
        <div className="col-md-6">
          <InputField
            label="Plat No *"
            type="text"
            name="no_plat"
            value={form.no_plat}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.no_plat}
            errorMessage={errors.no_plat}
            icon={<FaTruck />}
          />
        </div>
        <div className="col-md-6">
          <DatePickerField
            label="Clock Out *"
            name="startDate"
            value={selectedDate}
            onChange={handleDateChange}
            icon={<FaCalendarAlt />}
            error={!selectedDate} // contoh error: jika belum pilih tanggal
            errorMessage="The date cannot be empty"
          />
        </div>
      </div>
      {/* <InputField
        label="Desc *"
        type="text"
        name="spbDesc"
        value={form.spbDesc}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.spbDesc}
        errorMessage={errors.spbDesc}
        icon={<FaFileAlt />}
      /> */}

      <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-md border border-gray-200">
        {/* Search Field */}
        <div className="mb-3">
          <InputField
            label="Product List * Pack"
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
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    qty={product.qty}
                    onQtyChange={(qty) => updateQty(product.id, qty)}
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
                  Estimated invoice Details
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
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalData.products.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>
                          {new Intl.NumberFormat("id-ID").format(product.price)}
                        </td>
                        <td>{product.qty}</td>
                        <td>
                          {new Intl.NumberFormat("id-ID").format(
                            product.price * product.qty
                          )}
                        </td>
                      </tr>
                    ))}
                    {form.brgLuar != false && (
                      <tr key={products.length}>
                        <td>{form.product_name}</td>
                        <td>
                          {new Intl.NumberFormat("id-ID").format(
                            form.product_price
                          )}
                        </td>
                        <td>{form.product_qty}</td>
                        <td>
                          {new Intl.NumberFormat("id-ID").format(
                            form.product_price * form.product_qty
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="d-flex justify-content-between">
                  <strong>Subtotal:</strong>
                  <span>
                    {new Intl.NumberFormat("id-ID").format(
                      modalData.invoice.total_amount
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <strong>Fine:</strong>
                  <span>
                    {" "}
                    {new Intl.NumberFormat("id-ID").format(
                      modalData.invoice.fine
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <strong>Charge:</strong>
                  <span>
                    {" "}
                    {new Intl.NumberFormat("id-ID").format(
                      modalData.invoice.charge
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <span>
                    {new Intl.NumberFormat("id-ID").format(
                      modalData.invoice.total_amount +
                        modalData.invoice.fine +
                        modalData.invoice.charge
                    )}
                  </span>
                </div>
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
                  onClick={handleCreateInvoice}
                >
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <br></br>
      <RadioToggle
        label="Barang Luar *"
        name="brg_luar"
        isActive={form.brgLuar}
        onChange={handleBrgLuarChange}
        error={false}
      />
      {form.brgLuar !== false && (
        <div
          className="container flex flex-wrap overflow-y-auto space-y-3 bg-gray-50 border border-gray-300 rounded-lg p-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 mt-3"
          style={{ maxHeight: "250px" }}
        >
          <h6>Barang Luar</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <InputField
                label="Product Name *"
                type="text"
                name="product_name"
                value={form.product_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.product_name}
                errorMessage={errors.product_name}
                icon={<FaBox />}
              />
            </div>
            <div className="col-md-6">
              <InputFieldNumber
                label="Product Price *"
                name="product_price"
                value={form.product_price}
                onChange={handlePriceChange}
                onBlur={handleBlur}
                error={!!errors.product_price}
                errorMessage={errors.product_price}
                icon={<FaTag />}
              />
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <InputFieldNumber
                label="Product Qty *"
                name="product_qty"
                value={form.product_qty}
                onChange={handleQtyChange}
                onBlur={handleBlur}
                error={!!errors.product_qty}
                errorMessage={errors.product_qty}
                icon={<FaListOl />}
              />
            </div>
            <div className="col-md-6">
              <InputFieldNumber
                label="Total *"
                name="product_total_price"
                value={form.product_total_price}
                // onChange={handleQtyChange}
                // onBlur={handleBlur}
                // error={!!errors.product_qty}
                // errorMessage={errors.product_qty}
                readOnly
                icon={<FaTag />}
              />
            </div>
          </div>
        </div>
      )}

      <div className="text-end mt-3">
        <button type="submit" className="btn btn-primary px-4">
          Save <FaSave className="ms-2" />
        </button>
      </div>
    </form>
  );
};

const CreateTransOutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb
          title="Transaction"
          items={["Transaction Out", "Create Transaction Out"]}
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
        <CreateTransOutForm />
      </div>
    </div>
  );
};

export default CreateTransOutPage;
