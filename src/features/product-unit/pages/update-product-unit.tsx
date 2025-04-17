import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaBalanceScale } from "react-icons/fa";
import InputField from "../../../components/inputfield";
import { useNavigate, useParams } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import {
  getProductUnitById,
  updateProductUnitById,
} from "../services/product-unit.service";
import InputFieldNumber from "../../../components/inputfieldnumber";
import { FaBox, FaWeightHanging } from "react-icons/fa6";
import { getAllProducts } from "../../product/services/product.service";
import Dropdown from "../../../components/dropdown";

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

const UpdateProductUnitForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);

  const { id } = useParams<{ id: string }>();

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
    if (id) {
      const ProductUnitId = parseInt(id, 10);
      fetchProducts();
      fetchProductUnitById(ProductUnitId);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const products = await getAllProducts();
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchProductUnitById = async (id: number) => {
    try {
      const ProductUnitData = await getProductUnitById(id);
      setForm({
        name: ProductUnitData.name || "",
        conversionToKg: ProductUnitData.conversion_to_kg || 0,
        productId: ProductUnitData.productId,
      });
    } catch (error) {
      console.error("Error fetching Product Unit:", error);
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
        const ProductUnitId = parseInt(id || "0", 10);
        const newForm = {
          name: form.name,
          conversion_to_kg: form.conversionToKg,
        };

        await updateProductUnitById(ProductUnitId, newForm);

        navigate("/master/product-unit");
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
            label="Charge Per KG *"
            name="amount"
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
        value={String(form.productId)}
        options={products.map((product) => ({
          value: product.id.toString(),
          label: product.name,
        }))}
        onChange={handleDropdownChange}
        error={!!errors.productId}
        errorMessage={errors.productId}
        icon={<FaBox />}
        readOnly
      />

      <div className="text-end mt-3">
        <button type="submit" className="btn btn-primary px-4">
          Save <FaSave className="ms-2" />
        </button>
      </div>
    </form>
  );
};

const UpdateProductUnitPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb
          title="Master"
          items={["Product Unit", "Edit Product Unit"]}
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
        <UpdateProductUnitForm />
      </div>
    </div>
  );
};

export default UpdateProductUnitPage;
