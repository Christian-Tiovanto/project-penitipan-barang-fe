import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import { FaBox } from "react-icons/fa6";
import Dropdown from "../../../components/dropdown";
import { getAllCustomers } from "../../customer/services/customer.service";
import { getAllProducts } from "../../product/services/product.service";
import InputField from "../../../components/inputfield";
import ProductCard from "../../../components/product-card";
import { createTransOut } from "../services/trans-out.service";

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

interface Customer {
  id: number;
  name: string;
  code: string;
  address: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

const CreateTransOutForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [form, setForm] = useState({
    customerId: "",
    no_plat: "",
  });

  const [errors, setErrors] = useState({
    customerId: "",
    no_plat: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

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

    // if (!form.productId) {
    //   newErrors.productId = "Please Select a Product";
    // }

    if (!form.customerId) {
      newErrors.customerId = "Please Select a Customer";
    }

    if (!form.no_plat.trim()) {
      newErrors.no_plat = "This field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDropdownCustomerChange = (value: string) => {
    setForm({ ...form, customerId: value });
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

  const updateQty = (id: number, qty: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (validateForm()) {
        const payload = products
          .filter((p) => p.qty > 0)
          .map((p) => ({
            productId: p.id,
            converted_qty: p.qty,
          }));
        await createTransOut(
          parseInt(form.customerId, 10),
          form.no_plat,
          // form.clock_out,
          payload
        );
        navigate("/transaction");
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
      <div className="row g-3">
        <div className="col-md-6">
          <InputField
            label="No Plat *"
            type="text"
            name="no_plat"
            value={form.no_plat}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.no_plat}
            errorMessage={errors.no_plat}
            icon={<FaBox />}
          />
        </div>
        <div className="col-md-6">
          <InputField
            label="No Plat *"
            type="text"
            name="no_plat"
            value={form.no_plat}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.no_plat}
            errorMessage={errors.no_plat}
            icon={<FaBox />}
          />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-md border border-gray-200">
        {/* Search Field */}
        <div className="mb-3">
          <InputField
            label="Product List *"
            type="text"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FaSearch />}
          />
        </div>

        {/* Product List Container */}
        <div
          className="overflow-y-auto space-y-3 bg-gray-50 border border-gray-300 rounded-lg p-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
          style={{ maxHeight: "250px" }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                qty={product.qty}
                onQtyChange={(qty) => updateQty(product.id, qty)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">Product not found.</p>
            </div>
          )}
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
