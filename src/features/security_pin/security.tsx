import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaMoneyCheckAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useToast } from "../../contexts/toastContexts";
import InputFieldNumber from "../../components/inputfieldnumber";
import { getSecurityPin, updateSecurityPin } from "./services/security.service";
import InputField from "../../components/inputfield";
import { MdPin } from "react-icons/md";

const SecurityPinForm: React.FC = () => {
  const { showToast } = useToast();
  const [exist, setExist] = useState<boolean>(true);

  const [form, setForm] = useState({
    setting_value: "",
  });

  const [errors, setErrors] = useState({
    setting_value: "",
  });

  useEffect(() => {
    fetchSecurityPinById();
  }, []);

  const fetchSecurityPinById = async () => {
    try {
      const pinData = await getSecurityPin();
      console.log(pinData);
      setForm({
        setting_value: pinData.setting_value || 0,
      });
      setExist(true);
    } catch (error: any) {
      const finalMessage = `Failed to get data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");

      setExist(false);
      console.error("Error fetching Pin:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: any = {};

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        if (exist == true) {
          await updateSecurityPin(form);
        }

        showToast("Data updated successfully!", "success");
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
      <InputField
        label="Security Pin *"
        name="setting_value"
        type="text" // gunakan "text" atau "password", bukan "pin"
        value={form.setting_value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.setting_value}
        errorMessage={errors.setting_value}
        icon={<MdPin />}
      />

      <div className="text-end mt-3">
        <button type="submit" className="btn btn-primary px-4">
          Save <FaSave className="ms-2" />
        </button>
      </div>
    </form>
  );
};

const SecurityPinPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb title="Master" items={["Security Pin"]} />
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
        <SecurityPinForm />
      </div>
    </div>
  );
};

export default SecurityPinPage;
