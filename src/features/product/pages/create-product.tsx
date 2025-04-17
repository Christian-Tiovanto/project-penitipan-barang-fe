import React, { useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import InputField from "../../../components/inputfield";
import { useNavigate } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import InputFieldNumber from "../../../components/inputfieldnumber";
import { FaBox, FaTag } from "react-icons/fa6";
import { createProduct } from "../services/product.service";

const CreateProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    price: 0,
    // qty: 0,
    desc: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    // qty: "",
    desc: "",
  });

  const validateForm = () => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "This field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePriceChange = (newValue: number) => {
    setForm({
      ...form,
      price: newValue,
    });
  };

  // const handleQtyChange = (newValue: number) => {
  //     setForm({
  //         ...form,
  //         qty: newValue,
  //     });
  // };

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

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (validateForm()) {
        await createProduct(
          form.name,
          form.price,
          // form.qty,
          form.desc
        );
        navigate("/master/product");
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
            icon={<FaBox />}
          />
        </div>
        <div className="col-md-6">
          <InputFieldNumber
            label="Price *"
            name="price"
            value={form.price}
            onChange={handlePriceChange}
            onBlur={handleBlur}
            error={!!errors.price}
            errorMessage={errors.price}
            icon={<FaTag />}
          />
        </div>
      </div>

      {/* <InputFieldNumber
                label="Qty *"
                name="qty"
                value={form.qty}
                onChange={handleQtyChange}
                onBlur={handleBlur}
                error={!!errors.qty}
                errorMessage={errors.qty}
                icon={<FaClipboardList />}
            /> */}

      <InputField
        label="Desc *"
        type="text"
        name="desc"
        value={form.desc}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.desc}
        errorMessage={errors.desc}
        icon={<FaInfoCircle />}
      />

      <div className="text-end mt-3">
        <button type="submit" className="btn btn-primary px-4">
          Save <FaSave className="ms-2" />
        </button>
      </div>
    </form>
  );
};

const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb title="Master" items={["Product", "Create Product"]} />
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
        <CreateProductForm />
      </div>
    </div>
  );
};

export default CreateProductPage;
