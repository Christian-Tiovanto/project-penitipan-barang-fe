import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaBalanceScale } from "react-icons/fa";
import InputField from "../../../components/inputfield";
import { useNavigate } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import { createProductUnit } from "../services/product-unit.service";
import InputFieldNumber from "../../../components/inputfieldnumber";
import { FaBox, FaWeightHanging } from "react-icons/fa6";
import Dropdown from "../../../components/dropdown";
import { getAllProducts } from "../../product/services/product.service";
import { ProductUnit } from "../../trans-in/pages/create-trans-in";

export interface Product {
  id: number;
  name: string;
  price: number;
  qty: number;
  desc: string;
  product_unit?: ProductUnit[];
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

const CreateProductUnitForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);

  const [form, setForm] = useState({
    name: "",
    conversionToKg: 0,
    productId: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    conversionToKg: "",
    productId: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const products = await getAllProducts();
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "This field is required";
    }
    if (!form.productId) {
      newErrors.productId = "Please Select a Product";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConversionToKgChange = (newValue: number) => {
    setForm({
      ...form,
      conversionToKg: newValue,
    });
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

  const handleDropdownChange = (value: string) => {
    setForm({ ...form, productId: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (validateForm()) {
        await createProductUnit(
          parseInt(form.productId, 10),
          form.name,
          form.conversionToKg
        );
        navigate("/master/product-unit");
        showToast("Data added successfully!", "success");
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
      <div className="row g-3">
        <div className="col-md-6">
          <InputField
            label="Name *"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.name}
            errorMessage={errors.name}
            icon={<FaBalanceScale />}
          />
        </div>
        <div className="col-md-6">
          <InputFieldNumber
            label="Conversion To KG *"
            name="conversionToKg"
            value={form.conversionToKg}
            onChange={handleConversionToKgChange}
            onBlur={handleBlur}
            error={!!errors.conversionToKg}
            errorMessage={errors.conversionToKg}
            icon={<FaWeightHanging />}
          />
        </div>
      </div>

      <Dropdown
        label="Product *"
        value={form.productId}
        options={products.map((product) => ({
          value: product.id.toString(),
          label: product.name,
        }))}
        onChange={handleDropdownChange}
        error={!!errors.productId}
        errorMessage={errors.productId}
        icon={<FaBox />}
      />

      <div className="text-end mt-3">
        <button type="submit" className="btn btn-primary px-4">
          Save <FaSave className="ms-2" />
        </button>
      </div>
    </form>
  );
};

const CreateProductUnitPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb
          title="Master"
          items={["Product Unit", "Create Product Unit"]}
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
        <CreateProductUnitForm />
      </div>
    </div>
  );
};

export default CreateProductUnitPage;
