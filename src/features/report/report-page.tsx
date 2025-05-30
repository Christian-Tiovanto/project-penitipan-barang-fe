import React from "react";
import { useNavigate } from "react-router";
import MenuItem from "../../components/menu-item";
import { IoDocumentText } from "react-icons/io5";
import { FaListAlt } from "react-icons/fa";

const menuItems = [
  {
    label: "Transaction In",
    path: "/report/transaction-in",
    icon: <IoDocumentText className="me-2" />,
  },
  {
    label: "Transaction Out",
    path: "/report/transaction-out",
    icon: <IoDocumentText className="me-2" />,
  },
  {
    label: "Report Paidoff",
    path: "/report/paidoff",
    icon: <IoDocumentText className="me-2" />,
  },
  {
    label: "To Paid Report",
    path: "/report/ar-to-paid",
    icon: <IoDocumentText className="me-2" />,
  },
  {
    label: "Ar Mixed Report",
    path: "/report/ar-mixed-report",
    icon: <IoDocumentText className="me-2" />,
  },
  // {
  //   label: "Customer Product Stock",
  //   path: "/report/customer-product-stock",
  //   icon: <IoDocumentText className="me-2" />,
  // },
  {
    label: "Stock Book",
    path: "/report/stock-book",
    icon: <IoDocumentText className="me-2" />,
  },
  {
    label: "Stock Invoice Report",
    path: "/report/stock-invoice-report",
    icon: <IoDocumentText className="me-2" />,
  },
  {
    label: "Stock Report",
    path: "/report/stock-report",
    icon: <IoDocumentText className="me-2" />,
  },
  {
    label: "Cost Report",
    path: "/report/cost-report",
    icon: <IoDocumentText className="me-2" />,
  },
  {
    label: "Nett Income Report",
    path: "/report/nett-income",
    icon: <IoDocumentText className="me-2" />,
  },
  {
    label: "Aging Report",
    path: "/report/aging-report",
    icon: <IoDocumentText className="me-2" />,
  },
  {
    label: "Customer Product Mutation",
    path: "/report/customer-product-mutation",
    icon: <IoDocumentText className="me-2" />,
  },
  {
    label: "Ar List",
    path: "/report/ar-list",
    icon: <FaListAlt className="me-2" />,
  },
  {
    label: "Invoice List",
    path: "/report/invoice-list",
    icon: <FaListAlt className="me-2" />,
  },
];

const ReportPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2 className="p-3 mb-3 fw-bold mb-0">Report</h2>
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

export default ReportPage;
