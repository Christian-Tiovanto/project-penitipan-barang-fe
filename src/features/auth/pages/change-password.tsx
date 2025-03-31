import React, { useState } from "react";
import Breadcrumb from "../components/breadcrumb";
import { FaSave, FaArrowLeft, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { InputField } from "../components/inputfield";
import { useNavigate } from "react-router";
import { FaUnlock } from "react-icons/fa6";

const ChangePasswordForm: React.FC = () => {
    const [form, setForm] = useState({
        email: "Christianto@gmail.com",
        fullName: "Christianto vanto",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [errors, setErrors] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

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
        } else if (form.confirmNewPassword !== form.oldPassword) {
            newErrors.confirmNewPassword = "Confirm New Password do not match with New Password";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            console.log("password change:", form);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-3">
                <div className="col-md-6">
                    <InputField label="Email *" value={form.email} icon={<FaEnvelope />} readOnly />
                </div>
                <div className="col-md-6">
                    <InputField label="Full Name *" value={form.fullName} icon={<FaUser />} readOnly />
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
            {/* Header & Breadcrumb */}
            <div className="d-flex justify-content-between align-items-center p-3 mb-3">
                <Breadcrumb title="Master" items={["Change Password"]} />
                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="me-2" />
                    Back
                </button>
            </div>

            {/* Card */}
            <div className="card shadow-lg border-0 rounded-4 p-4">
                <ChangePasswordForm />
            </div>
        </div>
    );
};

export default ChangePasswordPage;
