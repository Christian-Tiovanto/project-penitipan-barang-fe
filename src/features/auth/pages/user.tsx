import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/breadcrumb";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import MuiTable from "../components/table";
import { getAllUsers } from "../services/login.service";

const UserPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
  ];

  // const users = await getAllUsers(10, 1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers(10, 1);
        console.log(response.data);
        setUsers(response.data ?? []); // Ambil `data` yang berupa array
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // const users = [
  //     { id: 1, name: "John Doe", email: "john@example.com" },
  //     { id: 2, name: "Jane Smith", email: "jane@example.com" },
  //     { id: 3, name: "John Doe", email: "john@example.com" },
  //     { id: 4, name: "Jane Smith", email: "jane@example.com" },
  //     { id: 5, name: "John Doe", email: "john@example.com" },
  //     { id: 6, name: "Jane Smith", email: "jane@example.com" },
  //     { id: 7, name: "John Doe", email: "john@example.com" },
  //     { id: 8, name: "Jane Smith", email: "jane@example.com" },
  //     { id: 9, name: "John Doe", email: "john@example.com" },
  //     { id: 10, name: "Jane Smith", email: "jane@example.com" },
  // ];

  const handleEdit = (row: any) => {
    console.log("Edit user:", row);
    navigate(`/master/user/edit-user/${row.id}`);
  };

  const handleDelete = (row: any) => {
    console.log("Delete user:", row);
  };

  const handleAdd = () => {
    console.log("USER ADD");
    navigate("/master/user/create-user");
  };

  return (
    <div className="container mt-4">
      {/* Header & Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center p-3 mb-3">
        <Breadcrumb title="Master" items={["User"]} />
        <button
          type="button"
          className="btn btn-outline-secondary px-4"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>
      </div>

      {/* Card */}
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <MuiTable
          columns={columns}
          data={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>
    </div>
  );
};

export default UserPage;
