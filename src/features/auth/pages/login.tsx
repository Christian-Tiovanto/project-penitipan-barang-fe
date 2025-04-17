import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Button from "../../../components/loginbutton";
import { MdLogin } from "react-icons/md";
import { login, getToken } from "../services/auth.service"; // Import service
import { useNavigate } from "react-router";
import InputFieldLogin from "../../../components/inputfieldlogin";
import { useToast } from "../../../contexts/toastContexts";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userData = await login(email, password);
      const token = getToken();

      navigate("/master"); // Redirect setelah login
      showToast("Login successfully!", "success");
    } catch (error: any) {
      const finalMessage = `Failed to login.\n${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`;
      showToast(finalMessage, "danger");
    }
  };

  return (
    <div
      className="container min-vh-70 d-flex align-items-center justify-content-center"
      style={{ width: "100%", height: "90vh", paddingTop: "2rem" }}
    >
      <div
        className="card shadow-lg p-4 text-center"
        style={{
          width: "90%",
          maxWidth: "600px",
          gap: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="https://pos.okgo.co.id/img/logo_black.44e75403.png"
          alt="OKGO Logo"
          className="img-fluid"
          style={{ maxWidth: "40%" }}
        />
        <form
          onSubmit={handleSubmit}
          className="d-grid gap-4"
          style={{ width: "80%", maxWidth: "400px" }}
        >
          <InputFieldLogin
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<FaEnvelope className="text-muted" />}
          />
          <InputFieldLogin
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<FaLock className="text-muted" />}
          />
          <Button text="Sign In" icon={<MdLogin />} type="submit" />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
