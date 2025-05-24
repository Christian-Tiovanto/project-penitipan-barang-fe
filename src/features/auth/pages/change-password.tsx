import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import {
  FaSave,
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import InputField from "../../../components/inputfield";
import { useNavigate } from "react-router";
import { FaUnlock } from "react-icons/fa6";
import {
  getSecurityPin,
  updatePasswordByIdToken,
} from "../services/auth.service";
import { useToast } from "../../../contexts/toastContexts";

const ChangePasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    fetchUserByIdToken();
  }, []);

  const fetchUserByIdToken = async () => {
    try {
      const userData = await getSecurityPin();
      setForm({
        email: userData.email || "",
        fullName: userData.fullname || "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !value.trim()
        ? "This field is required"
        : name === "email" && !value.includes("@")
        ? "Invalid email format. Example: user@example.com"
        : "",
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.oldPassword.trim()) {
      newErrors.oldPassword = "This field is required";
    }

    if (!form.newPassword.trim()) {
      newErrors.newPassword = "This field is required";
    }

    if (!form.confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = "This field is required";
    } else if (form.confirmNewPassword != form.newPassword) {
      newErrors.confirmNewPassword =
        "Confirm Password do not match with New Password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (validateForm()) {
        await updatePasswordByIdToken(form.oldPassword, form.newPassword);
        navigate("/master");
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
            label="Email *"
            value={form.email}
            icon={<FaEnvelope />}
            readOnly
          />
        </div>
        <div className="col-md-6">
          <InputField
            label="Full Name *"
            value={form.fullName}
            icon={<FaUser />}
            readOnly
          />
        </div>
      </div>

      <InputField
        label="Old Password *"
        type="password"
        name="oldPassword"
        value={form.oldPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.oldPassword}
        errorMessage={errors.oldPassword}
        icon={<FaUnlock />}
      />

      <InputField
        label="New Password *"
        type="password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.newPassword}
        errorMessage={errors.newPassword}
        icon={<FaLock />}
      />

      <InputField
        label="Confirm New Password *"
        type="password"
        name="confirmNewPassword"
        value={form.confirmNewPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.confirmNewPassword}
        errorMessage={errors.confirmNewPassword}
        icon={<FaLock />}
      />

      <div className="text-end mt-3">
        <button type="submit" className="btn btn-primary px-4">
          Save <FaSave className="ms-2" />
        </button>
      </div>
    </form>
  );
};

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb title="Master" items={["Change Password"]} />
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
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
