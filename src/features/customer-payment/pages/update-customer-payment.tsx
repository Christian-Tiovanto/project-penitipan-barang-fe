import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
// import { createProductUnit } from "../services/customer-payment.service";
import InputFieldNumber from "../../../components/inputfieldnumber";
import { FaBox, FaWeightHanging } from "react-icons/fa6";
import Dropdown from "../../../components/dropdown";
import { getAllCustomers } from "../../customer/services/customer.service";
import { getAllPaymentMethods } from "../../payment-method/services/payment-method.service";
import RadioToggle from "../../../components/radio-toggle";
import {
  createCustomerPayment,
  getCustomerPaymentById,
  updateCustomerPaymentById,
} from "../services/customer-payment.service";
import { useParams } from "react-router";

export interface Customer {
  id: number;
  name: string;
  code: string;
  address: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

interface PaymentMethod {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

const UpdateCustomerPaymentForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [paymentMethods, setpaymentMethods] = useState<PaymentMethod[]>([]);
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    customerId: "",
    paymentMethodId: "",
    charge: 0,
    status: true,
    min_pay: 0,
  });

  const [errors, setErrors] = useState({
    customerId: "",
    paymentMethodId: "",
    charge: "",
    status: "",
    min_pay: "",
  });

  useEffect(() => {
    if (id) {
      const customerPaymentId = parseInt(id, 10);
      fetchCustomers();
      fetchPaymentMethods();
      fetchCustomerPaymentById(customerPaymentId);
    }
  }, []);

  const fetchCustomers = async () => {
    try {
      const customers = await getAllCustomers();
      setCustomers(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const paymentMethods = await getAllPaymentMethods();
      setpaymentMethods(paymentMethods);
    } catch (error) {
      console.error("Error fetching Payment Methods:", error);
    }
  };

  const fetchCustomerPaymentById = async (id: number) => {
    try {
      const CustomerPaymentData = await getCustomerPaymentById(id);
      setForm({
        customerId: CustomerPaymentData.customerId,
        paymentMethodId: CustomerPaymentData.payment_methodId,
        charge: CustomerPaymentData.charge || 0,
        min_pay: CustomerPaymentData.min_pay || 0,
        status: CustomerPaymentData.status,
      });
    } catch (error) {
      console.error("Error fetching Product Unit:", error);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!form.customerId) {
      newErrors.customerId = "Please Select a Customer";
    }

    if (!form.paymentMethodId) {
      newErrors.paymentMethodId = "Please Select a Payment Method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChargeChange = (newValue: number) => {
    setForm({
      ...form,
      charge: newValue,
    });
  };

  const handleMinPayChange = (newValue: number) => {
    setForm({
      ...form,
      min_pay: newValue,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !value.trim() ? "This field is required" : "",
    }));
  };

  const handleDropdownCustomerChange = (value: string) => {
    setForm({ ...form, customerId: value });
  };

  const handleDropdownPaymentMethodChange = (value: string) => {
    setForm({ ...form, paymentMethodId: value });
  };

  const handleSatusChange = (value: boolean) => {
    setForm({ ...form, status: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (validateForm()) {
        const CustomerPaymentId = parseInt(id || "0", 10);

        const newForm = {
          charge: form.charge,
          status: form.status,
          min_pay: form.min_pay,
        };

        await updateCustomerPaymentById(CustomerPaymentId, newForm);

        navigate("/master/customer-payment");
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
            readOnly
          />
        </div>
        <div className="col-md-6">
          <Dropdown
            label="Payment Method *"
            value={String(form.paymentMethodId)}
            options={paymentMethods.map((paymentMethod) => ({
              value: paymentMethod.id.toString(),
              label: paymentMethod.name,
            }))}
            onChange={handleDropdownPaymentMethodChange}
            error={!!errors.paymentMethodId}
            errorMessage={errors.paymentMethodId}
            icon={<FaBox />}
            readOnly
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <InputFieldNumber
            label="Charge *"
            name="charge"
            value={form.charge}
            onChange={handleChargeChange}
            onBlur={handleBlur}
            error={!!errors.charge}
            errorMessage={errors.charge}
            icon={<FaWeightHanging />}
          />
        </div>
        <div className="col-md-6">
          <InputFieldNumber
            label="Min Pay *"
            name="minPay"
            value={form.min_pay}
            onChange={handleMinPayChange}
            onBlur={handleBlur}
            error={!!errors.min_pay}
            errorMessage={errors.min_pay}
            icon={<FaWeightHanging />}
          />
        </div>
      </div>

      <RadioToggle
        label="Status *"
        name="status"
        isActive={form.status}
        onChange={handleSatusChange}
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

const UpdateCustomerPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb
          title="Master"
          items={["Customer Payment", "Edit Customer Payment"]}
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
        <UpdateCustomerPaymentForm />
      </div>
    </div>
  );
};

export default UpdateCustomerPaymentPage;
