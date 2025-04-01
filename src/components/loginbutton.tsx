import React from "react";

type ButtonProps = {
    text: string;
    onClick?: () => Promise<void> | void;
    type?: "button" | "submit" | "reset";
    icon?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ text, onClick, type = "button", icon }) => {
    return (
        <button
            className="btn w-100 text-white fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
            style={{
                backgroundImage: "linear-gradient(to right, rgb(144, 202, 249) 0%, rgb(30, 136, 229) 51%, rgb(126, 87, 194) 100%)",
                borderRadius: "50px",
                fontSize: "1rem",
                border: "none",
                padding: "12px 24px",
            }}
            onClick={onClick}
            type={type}
        >
            <span>{text}</span>
            {icon && <span style={{ fontSize: "1.5rem", display: "flex", alignItems: "center" }}>{icon}</span>}
        </button>
    );
};

export default Button;
