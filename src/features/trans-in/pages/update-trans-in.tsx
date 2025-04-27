import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaBalanceScale } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import InputFieldNumber from "../../../components/inputfieldnumber";
import { FaBox, FaClipboardList, FaClipboardUser } from "react-icons/fa6";
import {
  createTransIn,
  getTransInById,
  updateTransInById,
} from "../services/trans-in.service";
import Dropdown from "../../../components/dropdown";
import { getProductUnitsByProductId } from "../../product-unit/services/product-unit.service";
import { getAllCustomers } from "../../customer/services/customer.service";
import { getProductById } from "../../product/services/product.service";
import RadioToggle from "../../../components/radio-toggle";
import { getUserByIdToken } from "../../auth/services/auth.service";

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

interface ProductUnit {
  id: number;
  product: number;
  productId: number;
  name: string;
  conversion_to_kg: number;
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

const UpdateTransInForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    qty: 0,
    productId: "",
    productUnitId: "",
    customerId: "",
    isCharge: false,
  });

  const [errors, setErrors] = useState({
    qty: "",
    productId: "",
    productUnitId: "",
    customerId: "",
    isCharge: "",
  });

  useEffect(() => {
    const getInitialData = async () => {
      if (id) {
        const transInId = parseInt(id, 10);
        const transIn = await fetchTransInById(transInId);

        await fetchProducts(transIn.productId);
        const productUnits = await fetchProductUnits(transIn.productId);
        await fetchCustomers();
        await setDataForm(transIn, productUnits);
      }
    };

    getInitialData();
  }, []);

  const fetchProducts = async (id: number) => {
    try {
      const product = await getProductById(id);
      await setProducts([product]);
    } catch (error) {
      const finalMessage = `Failed to get data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
      console.error("Error fetching product:", error);
    }
  };

  const fetchProductUnits = async (id: number) => {
    try {
      const productUnits = await getProductUnitsByProductId(id);
      await setProductUnits(productUnits);
      return productUnits;
    } catch (error) {
      const finalMessage = `Failed to get data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
      console.error("Error fetching product units:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const customers = await getAllCustomers();
      await setCustomers(customers);
    } catch (error) {
      const finalMessage = `Failed to get data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
      console.error("Error fetching customers:", error);
    }
  };

  const fetchTransInById = async (id: number) => {
    try {
      const TransInData = await getTransInById(id);
      return TransInData;
    } catch (error) {
      const finalMessage = `Failed to get data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
      console.error("Error fetching Trans in:", error);
    }
  };

  const setDataForm = async (TransInData: any, productUnits: ProductUnit[]) => {
    try {
      const matchedUnit = productUnits.find(
        (unit) => unit.name.toLowerCase() === TransInData.unit.toLowerCase()
      );

      const id = matchedUnit?.id.toString();
      setForm({
        productId: TransInData.productId,
        qty: TransInData.qty || 0,
        productUnitId: id || "",
        customerId: TransInData.customerId,
        isCharge: TransInData.is_charge,
      });
    } catch (error) {
      console.error("Error set from trans in:", error);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.productId) {
      newErrors.productId = "Please Select a Product";
    }

    if (!form.customerId) {
      newErrors.customerId = "Please Select a Customer";
    }

    if (!form.productUnitId) {
      newErrors.productUnitId = "Please Select a Product Unit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDropdownProductUnitChange = (value: string) => {
    setForm({ ...form, productUnitId: value });
  };

  const handleDropdownCustomerChange = (value: string) => {
    setForm({ ...form, customerId: value });
  };

  const handleQtyChange = (newValue: number) => {
    setForm({
      ...form,
      qty: newValue,
    });
  };

  const handleIsChargeChange = (value: boolean) => {
    setForm({ ...form, isCharge: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !value.trim() ? "This field is required" : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (validateForm()) {
        const transInId = parseInt(id || "0", 10);
        const newForm = {
          productId: form.productId,
          customerId: form.customerId,
          qty: form.qty,
          unitId: form.productUnitId,
          is_charge: form.isCharge,
        };
        const transIn = await updateTransInById(transInId, newForm);
        navigate(
          `/transaction/in/history-in/${transIn.transaction_in_headerId}`
        );
        showToast("Data updated successfully!", "success");
      }
    } catch (error: any) {
      const finalMessage = `Failed to update data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <Dropdown
            label="Product *"
            value={String(form.productId)}
            options={products.map((product) => ({
              value: product.id.toString(),
              label: product.name,
            }))}
            error={!!errors.productId}
            errorMessage={errors.productId}
            icon={<FaBox />}
            readOnly
          />
        </div>
        <div className="col-md-6">
          <Dropdown
            label="Product Unit *"
            value={String(form.productUnitId)}
            options={productUnits.map((productUnit) => ({
              value: productUnit.id.toString(),
              label: productUnit.name,
            }))}
            onChange={handleDropdownProductUnitChange}
            error={!!errors.productUnitId}
            errorMessage={errors.productUnitId}
            icon={<FaBalanceScale />}
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
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
        </div>
        <div className="col-md-6">
          <InputFieldNumber
            label="Qty *"
            name="qty"
            value={form.qty}
            onChange={handleQtyChange}
            onBlur={handleBlur}
            error={!!errors.qty}
            errorMessage={errors.qty}
            icon={<FaClipboardList />}
          />
        </div>
      </div>

      <RadioToggle
        label="Charge *"
        name="is_charge"
        isActive={form.isCharge}
        onChange={handleIsChargeChange}
        error={false}
      />

      <div className="text-end mt-3">
        <button type="submit" className="btn btn-primary px-4">
          Save <FaSave className="ms-2" />
        </button>
      </div>
    </form>
  );
};

const UpdateTransInPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    setIsPinModalOpen(true);
  }, []);

  const handleCheckPin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 🔥 cegah reload form

    try {
      if (pin.trim()) {
        const user = await getUserByIdToken();
        if (user.pin === pin) {
          showToast("Pin validated successfully!", "success");
          setIsPinModalOpen(false);
        } else {
          setIsPinModalOpen(true);
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb
          title="Transaction"
          items={["Transaction In", "Edit Transaction In"]}
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
        <UpdateTransInForm />
      </div>

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
                    onClick={() => navigate(-1)}
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
  );
};

export default UpdateTransInPage;
