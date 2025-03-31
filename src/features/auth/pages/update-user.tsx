import React, { useState, useEffect } from "react";
import Breadcrumb from "../components/breadcrumb";
import { FaSave, FaArrowLeft, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Dropdown, InputField } from "../components/inputfield";
import { useNavigate, useParams } from "react-router";
import { getUserById } from "../services/login.service";

const UpdateUserForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Ambil id dari URL

    const [form, setForm] = useState({
        email: "",
        fullName: "",
        password: "",
        role: ""
    });

    const [errors, setErrors] = useState({
        password: "",
        email: "",
        fullName: "",
        role: "",
    });

    useEffect(() => {
        if (id) {
            // Misalnya kamu ingin melakukan fetch user berdasarkan id
            const userId = parseInt(id, 10); // atau bisa juga pakai `Number(id)`
            fetchUserById(userId);
        }
    }, []);

    const fetchUserById = async (id: number) => {
        try {
            const userData = await getUserById(id);
            setForm({
                email: userData.email || "",
                fullName: userData.fullName || "",
                password: userData.password || "",
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

        if (!form.fullName.trim()) {
            newErrors.fullName = "This field is required";
        }

        if (!form.password.trim()) {
            newErrors.password = "This field is required";
        }

        if (!form.role) {
            newErrors.role = "Please select a category";
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
                role: "Please Select A Role",
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();


        if (validateForm()) {
            console.log("User created successfully:", form);
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
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.fullName}
                        errorMessage={errors.fullName}
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

            {/* Tombol Simpan */}
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
                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
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
