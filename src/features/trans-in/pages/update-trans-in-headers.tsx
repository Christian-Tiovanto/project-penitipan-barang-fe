import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
// import { createProductUnit } from "../services/customer-payment.service";
import InputFieldNumber from "../../../components/inputfieldnumber";
import { FaBox, FaWeightHanging } from "react-icons/fa6";
import Dropdown from "../../../components/dropdown";
import { getAllCustomers } from "../../customer/services/customer.service";
import { getAllPaymentMethods } from "../../payment-method/services/payment-method.service";
import RadioToggle from "../../../components/radio-toggle";
import { useParams } from "react-router";
import InputField from "../../../components/inputfield";
import {
  getTransInHeaderById,
  updateTransInHeaderById,
} from "../services/trans-in.service";
import { getSecurityPin } from "../../auth/services/auth.service";

export interface Customer {
  id: number;
  name: string;
  code: string;
  address: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

const UpdateTransInHeaderForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    customerId: "",
    desc: "",
  });

  const [errors, setErrors] = useState({
    customerId: "",
    desc: "",
  });

  useEffect(() => {
    if (id) {
      const transInHeaderId = parseInt(id, 10);
      fetchCustomers();
      fetchTransInHeaderById(transInHeaderId);
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

  const fetchTransInHeaderById = async (id: number) => {
    try {
      const transInHeaderData = await getTransInHeaderById(id);
      setForm({
        customerId: transInHeaderData.customerId,
        desc: transInHeaderData.desc,
      });
    } catch (error) {
      console.error("Error fetching Trans In Header:", error);
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
        const transInHeaderId = parseInt(id || "0", 10);

        const newForm = {
          customerId: form.customerId,
          desc: form.desc,
        };

        await updateTransInHeaderById(transInHeaderId, newForm);

        navigate(`/transaction/in/history-in/${transInHeaderId}`);
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
          />
        </div>
        <div className="col-md-6">
          <InputField
            label="Desc *"
            type="text"
            name="desc"
            value={form.desc}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.desc}
            errorMessage={errors.desc}
            icon={<FaFileAlt />}
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

const UpdateTransInHeaderPage: React.FC = () => {
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
        const securityPin = await getSecurityPin();
        if (securityPin.setting_value === pin) {
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
          items={["Transaction In", "Edit Transaction In Header"]}
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
        <UpdateTransInHeaderForm />
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

export default UpdateTransInHeaderPage;
