import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaBalanceScale, FaInfoCircle, FaMapMarkerAlt } from "react-icons/fa";
import InputField from "../../../components/inputfield";
import { useNavigate, useParams } from "react-router";
import { useToast } from "../../../contexts/toastContexts";
import InputFieldNumber from "../../../components/inputfieldnumber";
import { FaBox, FaClipboardList, FaClipboardUser, FaHashtag, FaTag, FaWeightHanging } from "react-icons/fa6";
import { getCustomerById, updateCustomerById } from "../services/customer.service";
// import { getCustomerById, updateCustomerById } from "../services/customer.service";

const UpdateCustomerForm: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const { id } = useParams<{ id: string }>();

    const [form, setForm] = useState({
        name: "",
        code: "",
        address: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        code: "",
        address: "",
    });

    useEffect(() => {
        if (id) {
            const CustomerId = parseInt(id, 10);
            fetchCustomerById(CustomerId);
        }
    }, []);

    const fetchCustomerById = async (id: number) => {
        try {
            const CustomerData = await getCustomerById(id);
            setForm({
                name: CustomerData.name || "",
                code: CustomerData.code || "",
                address: CustomerData.address || "",
            });
        } catch (error) {
            console.error("Error fetching Customer :", error);
        }
    };

    const validateForm = () => {
        const newErrors: any = {};
        if (!form.name.trim()) {
            newErrors.name = "This field is required";
        }

        if (!form.code.trim()) {
            newErrors.code = "This field is required";
        }

        if (!form.address.trim()) {
            newErrors.address = "This field is required";
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
                const CustomerId = parseInt(id || "0", 10);

                await updateCustomerById(CustomerId, form)

                navigate("/master/customer")
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
                        label="Name *"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.name}
                        errorMessage={errors.name}
                        icon={<FaClipboardUser />} />
                </div>
                <div className="col-md-6">
                    <InputField
                        label="Code *"
                        type="text"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.code}
                        errorMessage={errors.code}
                        icon={<  FaHashtag />} />
                </div>
            </div>
            <InputField
                label="Address *"
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.address}
                errorMessage={errors.address}
                icon={<FaMapMarkerAlt />} />

            <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary px-4">
                    Save <FaSave className="ms-2" />
                </button>
            </div>
        </form>
    );
};


const UpdateCustomerPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center p-3 mb-3">
                <Breadcrumb title="Master" items={["Customer", "Edit Customer"]} />
                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="me-2" />
                    Back
                </button>
            </div>

            <div className="card shadow-lg border-0 rounded-4 p-4">
                <UpdateCustomerForm />
            </div>
        </div>
    );
};

export default UpdateCustomerPage;
