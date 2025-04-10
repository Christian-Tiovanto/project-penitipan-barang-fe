import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import {
  FaSave,
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import InputField from "../../../components/inputfield";
import { useNavigate, useParams } from "react-router";
import { getUserById, updateUserById } from "../services/auth.service";
import { useToast } from "../../../contexts/toastContexts";
import Dropdown from "../../../components/dropdown";
import { MdPin } from "react-icons/md";

const UpdateUserForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    email: "",
    fullname: "",
    pin: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    pin: "",
    email: "",
    fullname: "",
    role: "",
  });

  useEffect(() => {
    if (id) {
      const userId = parseInt(id, 10);
      fetchUserById(userId);
    }
  }, []);

  const fetchUserById = async (id: number) => {
    try {
      const userData = await getUserById(id);
      setForm({
        email: userData.email || "",
        fullname: userData.fullname || "",
        pin: userData.pin || "",
        role: userData.role || "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.email.trim()) {
      newErrors.email = "This field is required";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Invalid email format";
    }

    if (!form.fullname.trim()) {
      newErrors.fullname = "This field is required";
    }

    if (!form.pin.trim()) {
      newErrors.pin = "This field is required";
    }

    if (!form.role) {
      newErrors.role = "Please Select a Role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleDropdownBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    if (!e.target.value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: "Please Select a Role",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: "",
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDropdownChange = (value: string) => {
    setForm({ ...form, role: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (validateForm()) {
        const userId = parseInt(id || "0", 10);
        await updateUserById(userId, form);
        navigate("/master/user");
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
            label="Email *"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.email}
            errorMessage={errors.email}
            icon={<FaEnvelope />}
          />
        </div>
        <div className="col-md-6">
          <InputField
            label="Full Name *"
            type="text"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.fullname}
            errorMessage={errors.fullname}
            icon={<FaUser />}
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <Dropdown
            label="Role *"
            value={String(form.role)}
            options={[
              { value: "admin", label: "Admin" },
              { value: "default", label: "Default" },
            ]}
            onChange={handleDropdownChange}
            error={!!errors.role}
            errorMessage={errors.role}
            icon={<FaUser />}
          />
        </div>
        <div className="col-md-6">
          <InputField
            label="Pin *"
            type="text" // gunakan "text" atau "password", bukan "pin"
            name="pin"
            value={form.pin}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.pin}
            errorMessage={errors.pin}
            icon={<MdPin />}
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

const UpdateUserPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      {/* Header & Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb title="Master" items={["User", "Edit User"]} />
        <button
          type="button"
          className="btn btn-outline-secondary px-4"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>
      </div>

      {/* Card */}
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <UpdateUserForm />
      </div>
    </div>
  );
};

export default UpdateUserPage;
