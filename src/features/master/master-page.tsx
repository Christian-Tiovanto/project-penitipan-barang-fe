import React from "react";
import { useNavigate } from "react-router";
import {
  FaUser,
  FaLock,
  FaUserPlus,
  FaMoneyBillAlt,
  FaBalanceScale,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { FaBox, FaClipboardUser, FaCreditCard } from "react-icons/fa6";
import MenuItem from "../../components/menu-item";

const menuItems = [
  {
    label: "Profile",
    path: "/master/profile",
    icon: <FaUser className="me-2" />,
  },
  {
    label: "Change Password",
    path: "/master/change-password",
    icon: <FaLock className="me-2" />,
  },
  {
    label: "User",
    path: "/master/user",
    icon: <FaUserPlus className="me-2" />,
  },
  {
    label: "Product",
    path: "/master/product",
    icon: <FaBox className="me-2" />,
  },
  {
    label: "Product Unit",
    path: "/master/product-unit",
    icon: <FaBalanceScale className="me-2" />,
  },
  {
    label: "Customer",
    path: "/master/customer",
    icon: <FaClipboardUser className="me-2" />,
  },
  {
    label: "Customer Payment",
    path: "/master/customer-payment",
    icon: <FaCreditCard className="me-2" />,
  },
  {
    label: "Payment Method",
    path: "/master/payment-method",
    icon: <FaMoneyBillAlt className="me-2" />,
  },
  {
    label: "Charge",
    path: "/master/charge",
    icon: <FaMoneyCheckAlt className="me-2" />,
  },
];

const MasterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2 className="p-3 mb-3 fw-bold mb-0">Master</h2>
      <div className="list-group">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            item={item}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default MasterPage;
