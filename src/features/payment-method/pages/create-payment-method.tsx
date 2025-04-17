import React, { useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaMoneyBillAlt } from "react-icons/fa";
import InputField from "../../../components/inputfield";
import { useNavigate } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import { createPaymentMethod } from "../services/payment-method.service";

const CreatePaymentMethodForm: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [form, setForm] = useState({
        name: "",
    });

    const [errors, setErrors] = useState({
        name: "",
    });

    const validateForm = () => {
        const newErrors: any = {};
        if (!form.name.trim()) {
            newErrors.name = "This field is required";
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
                : "",
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();

            if (validateForm()) {
                await createPaymentMethod(form.name)
                navigate("/master/payment-method")
                showToast("Data added successfully!", "success");
            }
        } catch (error: any) {
            const finalMessage = `Failed to add data.\n${error?.response?.data?.message || error?.message || "Unknown error"}`;
            showToast(finalMessage, "danger");
        }

    };

    return (
        <form onSubmit={handleSubmit}>

            <InputField
                label="Name *"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.name}
                errorMessage={errors.name}
                icon={<FaMoneyBillAlt />} />


            <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary px-4">
                    Save <FaSave className="ms-2" />
                </button>
            </div>
        </form>
    );
};


const CreatePaymentMethodPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center p-3 mb-3">
                <Breadcrumb title="Master" items={["Payment Method", "Create Payment Method"]} />
                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="me-2" />
                    Back
                </button>
            </div>

            <div className="card shadow-lg border-0 rounded-4 p-4">
                <CreatePaymentMethodForm />
            </div>
        </div>
    );
};

export default CreatePaymentMethodPage;
