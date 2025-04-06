import React from "react";
import { useNavigate } from "react-router";
import MenuItem from "./components/menu-item";
import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";

const menuItems = [
    { label: "Transaction In", path: "/transaction/in", icon: <FaArrowCircleDown className="me-2" /> },
    { label: "Transaction Out", path: "/transaction/out", icon: <FaArrowCircleUp className="me-2" /> },
];

const TransactionPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-4">
            <h2 className="p-3 mb-3 fw-bold mb-0">Transaction</h2>
            <div className="list-group">
                {menuItems.map((item, index) => (
                    <MenuItem key={index} item={item} onClick={() => navigate(item.path)} />
                ))}
            </div>
        </div>
    );
};

export default TransactionPage;
