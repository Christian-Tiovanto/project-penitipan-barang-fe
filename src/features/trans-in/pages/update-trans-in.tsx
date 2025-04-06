import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import InputFieldNumber from "../../../components/inputfieldnumber";
import { FaBox, FaClipboardList } from "react-icons/fa6";
import {
  createTransIn,
  getTransInById,
  updateTransInById,
} from "../services/trans-in.service";
import Dropdown from "../../../components/dropdown";
import { getProductUnitsByProductId } from "../../product-unit/services/product-unit.service";
import { getAllCustomers } from "../../customer/services/customer.service";
import { getProductById } from "../../product/services/product.service";

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
  });

  const [errors, setErrors] = useState({
    qty: "",
    productId: "",
    productUnitId: "",
    customerId: "",
  });

  useEffect(() => {
    const getInitialData = async () => {
      if (id) {
        const transInId = parseInt(id, 10);
        const transIn = await fetchTransInById(transInId);

        fetchProducts(transIn.productId);
        fetchProductUnits(transIn.productId);
        fetchCustomers();
        setDataForm(transIn);
      }
    };

    getInitialData();
  }, []);

  const fetchProducts = async (id: number) => {
    try {
      const product = await getProductById(id);
      setProducts([product]);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchProductUnits = async (id: number) => {
    try {
      const productUnits = await getProductUnitsByProductId(id);
      setProductUnits(productUnits);
    } catch (error) {
      console.error("Error fetching product units:", error);
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

  const fetchTransInById = async (id: number) => {
    try {
      const TransInData = await getTransInById(id);

      return TransInData;
    } catch (error) {
      console.error("Error fetching Trans in:", error);
    }
  };

  const setDataForm = async (TransInData: any) => {
    try {
      setForm({
        productId: TransInData.productId,
        qty: TransInData.qty || 0,
        productUnitId: TransInData.productUnitId,
        customerId: TransInData.customerId,
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
        };
        console.log(newForm);
        await updateTransInById(transInId, newForm);
        navigate(`/transaction/in/history-in/${newForm.productId}`);
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
            icon={<FaBox />}
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
            icon={<FaBox />}
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
    </div>
  );
};

export default UpdateTransInPage;
