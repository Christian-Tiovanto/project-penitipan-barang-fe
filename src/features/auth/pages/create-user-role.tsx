import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/breadcrumb";
import {
  FaSave,
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import InputField from "../../../components/inputfield";
import { useNavigate, useParams } from "react-router";
import { getUserById, register } from "../services/auth.service";
import { useToast } from "../../../contexts/toastContexts";
import Dropdown from "../../../components/dropdown";
import { MdPin } from "react-icons/md";
import RadioToggle from "../../../components/radio-toggle";
import RadioToggleUserRoles from "../../../components/radio-toogle-user-roles";
import UserRoleCard from "../../../components/user-roles-card";
import { createUserRole, deleteUserRole } from "../services/user-role.service";

interface Role {
  id: number;
  label: string;
  name: string;
  status: boolean;
}

const CreateUserRole: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const enum UserRoleEnum {
    SUPERADMIN = "superadmin",
    ADMIN = "admin",
    DEFAULT = "default",
    AR_PAYMENT = "ar_payment",
    CASHFLOW = "cashflow",
    CHARGE = "charge",
    CUSTOMER = "customer",
    CUSTOMER_PAYMENT = "customer_payment",
    INVOICE = "invoice",
    PAYMENT_METHOD = "payment_method",
    PRODUCT = "product",
    PRODUCT_UNIT = "product_unit",
    REPORT = "report",
    SPB = "spb",
    TRANSACTION_IN = "transaction_in",
    TRANSACTION_OUT = "transaction_out",
  }

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      label: "Ar Payment *",
      name: UserRoleEnum.AR_PAYMENT,
      status: false,
    },
    {
      id: 2,
      label: "Cashflow *",
      name: UserRoleEnum.CASHFLOW,
      status: false,
    },
    {
      id: 3,
      label: "Charge *",
      name: UserRoleEnum.CHARGE,
      status: false,
    },
    {
      id: 4,
      label: "Customer *",
      name: UserRoleEnum.CUSTOMER,
      status: false,
    },
    {
      id: 5,
      label: "Customer Payment *",
      name: UserRoleEnum.CUSTOMER_PAYMENT,
      status: false,
    },
    {
      id: 6,
      label: "Invoice *",
      name: UserRoleEnum.INVOICE,
      status: false,
    },
    {
      id: 7,
      label: "Payment Method *",
      name: UserRoleEnum.PAYMENT_METHOD,
      status: false,
    },
    {
      id: 8,
      label: "Product *",
      name: UserRoleEnum.PRODUCT,
      status: false,
    },
    {
      id: 9,
      label: "Product Unit *",
      name: UserRoleEnum.PRODUCT_UNIT,
      status: false,
    },
    {
      id: 10,
      label: "Report *",
      name: UserRoleEnum.REPORT,
      status: false,
    },
    { id: 11, label: "Spb *", name: UserRoleEnum.SPB, status: false },
    {
      id: 12,
      label: "Transaction In *",
      name: UserRoleEnum.TRANSACTION_IN,
      status: false,
    },
    {
      id: 13,
      label: "Transaction Out *",
      name: UserRoleEnum.TRANSACTION_OUT,
      status: false,
    },
    {
      id: 14,
      label: "Admin *",
      name: UserRoleEnum.ADMIN,
      status: false,
    },
  ]);

  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : 0;

  useEffect(() => {
    const initialize = async () => {
      if (id) {
        const userId = parseInt(id, 10);

        // Langsung fetch data setelah setRoles
        await fetchData(userId);
      }
    };

    initialize();
  }, [id]);

  //   const [status, setStatus] = useState<boolean>();

  //   const handleStatusChange = (value: boolean) => {
  //     setStatus(value);
  //   };

  const fetchData = async (id: number) => {
    const user = await getUserById(id);
    const userRoles = user.user_role;

    userRoles.forEach((userRole) => {
      const filteredRole = roles?.find((role) => role.name === userRole.role);

      if (filteredRole) {
        // <= Tambahin cek ini
        setRoles((prev) =>
          prev.map((p) =>
            p.id === filteredRole.id ? { ...p, status: true } : p
          )
        );
      }
    });
  };

  const updateStatus = async (
    statusId: number,
    name: string,
    status: boolean
  ) => {
    try {
      const user = await getUserById(userId);
      const userRoles = user.user_role;

      const filteredRoles = userRoles.filter((role) => role.role === name);

      if (filteredRoles.length == 0 && status == true) {
        await createUserRole(userId, name);
      } else if (filteredRoles.length > 0 && status == false) {
        await deleteUserRole(userId, name);
      }
      //toaast
      setRoles((prev) =>
        prev.map((p) => (p.id === statusId ? { ...p, status } : p))
      );
      showToast("Data updated successfully!", "success");
    } catch (error: any) {
      const finalMessage = `Failed to update data.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
    }
  };

  return (
    <div
      className="container flex flex-wrap overflow-y-auto space-y-3 bg-gray-50 border border-gray-300 rounded-lg p-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
      style={{ maxHeight: "500px" }}
    >
      <div className="row">
        <h5>Set User Roles *</h5>

        {roles.length > 0 ? (
          roles.map((role) => (
            <div key={role.id} className="col-12 col-md-6">
              <UserRoleCard
                name={role.label}
                status={role.status}
                onStatusChange={(status) =>
                  updateStatus(role.id, role.name, status)
                }
              />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">Roles not found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CreateUserRolePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb title="Master" items={["User", "Create User Role"]} />
        <button
          type="button"
          className="btn btn-outline-secondary px-4"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>
      </div>

      <div className="card shadow-lg border-0 rounded-4 p-4">
        <CreateUserRole />
      </div>
    </div>
  );
};

export default CreateUserRolePage;
