import React from "react";

interface AlertProps {
    message: string;
}

const Alert: React.FC<AlertProps> = ({ message }) => {
    return <div className="alert alert-danger rounded-3 py-2">{message}</div>;
};

export default Alert;
