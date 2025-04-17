import { ReactNode } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import Breadcrumb from "./breadcrumb";

interface PageLayoutProps {
  title: string;
  items: string[];
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, items, children }) => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb title={title} items={items} />
        <button
          type="button"
          className="btn btn-outline-secondary px-4"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>
      </div>

      <div className="card shadow-lg border-0 rounded-4 p-4">{children}</div>
    </div>
  );
};

export default PageLayout;
