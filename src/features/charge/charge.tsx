import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/breadcrumb";
import { FaSave, FaArrowLeft, FaMoneyCheckAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useToast } from "../../contexts/toastContexts";
import InputFieldNumber from "../../components/inputfieldnumber";
import { createCharge, getChargeById, updateChargeById } from "./services/charge.service";

const ChargeForm: React.FC = () => {
    const { showToast } = useToast();
    const [exist, setExist] = useState<boolean>(true);

    const [form, setForm] = useState({
        amount: 0,
    });

    const [errors, setErrors] = useState({
        amount: "",
    });

    useEffect(() => {
        fetchChargeById();
    }, []);

    const fetchChargeById = async () => {
        try {
            const ChargeData = await getChargeById();
            setForm({
                amount: ChargeData.amount || 0,
            });
            setExist(true)
        } catch (error: any) {
            setExist(false)
            console.error("Error fetching Charge:", error);
        }
    };

    const handleAmountChange = (newValue: number) => {
        setForm({
            ...form,
            amount: newValue,
        });
    };

    const validateForm = () => {
        const newErrors: any = {};

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

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();

            if (validateForm()) {
                console.log(exist);
                if (exist == true) {
                    await updateChargeById(form);
                } else {
                    await createCharge(form.amount);
                }

                showToast("Data updated successfully!", "success");
            }
        } catch (error: any) {
            const finalMessage = `Failed to add data.\n${error?.response?.data?.message || error?.message || "Unknown error"}`;
            showToast(finalMessage, "danger");
        }

    };

    return (
        <form onSubmit={handleSubmit}>

            <InputFieldNumber
                label="Charge Per KG *"
                name="amount"
                value={form.amount}
                onChange={handleAmountChange}
                onBlur={handleBlur}
                error={!!errors.amount}
                errorMessage={errors.amount}
                icon={<FaMoneyCheckAlt />}
            />

            <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary px-4">
                    Save <FaSave className="ms-2" />
                </button>
            </div>
        </form>
    );
};


const ChargePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center p-3 mb-3">
                <Breadcrumb title="Master" items={["Charge"]} />
                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="me-2" />
                    Back
                </button>
            </div>

            <div className="card shadow-lg border-0 rounded-4 p-4">
                <ChargeForm />
            </div>
        </div>
    );
};

export default ChargePage;
