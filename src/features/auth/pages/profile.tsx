import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaEnvelope, FaUser } from "react-icons/fa";
import InputField from "../../../components/inputfield";
import { useNavigate } from "react-router";
import { getUserByIdToken, updateUserByIdToken } from "../services/auth.service";
import { useToast } from "../../../contexts/toastContexts";
import Dropdown from "../../../components/dropdown";

const ProfileForm: React.FC = () => {
    const { showToast } = useToast();
    const [form, setForm] = useState({
        email: "",
        fullName: "",
        role: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        fullName: "",
        role: "",
    });

    useEffect(() => {
        fetchUserByIdToken();
    }, []);

    const fetchUserByIdToken = async () => {
        try {
            const userData = await getUserByIdToken();
            setForm({
                email: userData.email || "",
                fullName: userData.fullname || "",
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

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (validateForm()) {
                const { fullName, ...requestData } = form;
                const updatedData = { ...requestData, fullname: fullName };

                await updateUserByIdToken(updatedData);
                showToast("Data updated successfully!", "success");
            }
        } catch (error: any) {
            const finalMessage = `Failed to update data.\n${error?.response?.data?.message || error?.message || "Unknown error"}`;
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
                value={String(form.role)}
                options={[
                    { value: "admin", label: "Admin" },
                    { value: "default", label: "Default" },
                ]}
                // onChange={handleDropdownChange}
                error={!!errors.role}
                errorMessage={errors.role}
                icon={<FaUser />}
                readOnly
            />

            <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary px-4">
                    Save <FaSave className="ms-2" />
                </button>
            </div>
        </form>
    );
};


const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center p-3 mb-3">
                <Breadcrumb title="Master" items={["Profile"]} />
                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="me-2" />
                    Back
                </button>
            </div>

            <div className="card shadow-lg border-0 rounded-4 p-4">
                <ProfileForm />
            </div>
        </div>
    );
};

export default ProfilePage;
