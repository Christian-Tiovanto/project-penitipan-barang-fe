import React, { useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import InputField from "../../../components/inputfield";
import { useNavigate } from "react-router";
import { register } from "../services/auth.service";
import { useToast } from "../../../contexts/toastContexts";
import Dropdown from "../../../components/dropdown";

const CreateUserForm: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [form, setForm] = useState({
        email: "",
        fullname: "",
        password: "",
        confirmPassword: "",
        role: ""
    });

    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
        email: "",
        fullname: "",
        role: "",
    });

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

        if (!form.password.trim()) {
            newErrors.password = "This field is required";
        }

        if (!form.confirmPassword.trim()) {
            newErrors.confirmPassword = "This field is required";
        } else if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!form.role) {
            newErrors.role = "Please Select a Role";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

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

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();

            if (validateForm()) {
                await register(form.email, form.fullname, form.password, form.role)
                navigate("/master/user")
                showToast("Data added successfully!", "success");
            }
        } catch (error: any) {
            const finalMessage = `Failed to add data.\n${error?.response?.data?.message || error?.message || "Unknown error"}`;
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
                        icon={<FaEnvelope />} />
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
                        icon={<FaUser />} />
                </div>
            </div>

            <Dropdown
                label="Role *"
                name="role"
                value={form.role}
                options={[
                    { value: "admin", label: "Admin" },
                    { value: "default", label: "Default" },
                ]}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                onBlur={handleDropdownBlur}
                error={!!errors.role}
                errorMessage={errors.role}
                icon={<FaUser />}
            />

            <InputField
                label="Password *"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.password}
                errorMessage={errors.password}
                icon={<FaLock />}
            />

            <InputField
                label="Confirm Pasword *"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword}
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


const CreateUserPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center p-3 mb-3">
                <Breadcrumb title="Master" items={["User", "Create User"]} />
                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="me-2" />
                    Back
                </button>
            </div>

            <div className="card shadow-lg border-0 rounded-4 p-4">
                <CreateUserForm />
            </div>
        </div>
    );
};

export default CreateUserPage;
