import React from "react";

interface RadioToggleProps {
    label: string;
    name: string;
    isActive: boolean;
    onChange: (value: boolean) => void;
    error?: boolean;
    errorMessage?: string;
}

const RadioToggle: React.FC<RadioToggleProps> = ({
    label,
    name,
    isActive,
    onChange,
    error = false,
    errorMessage = "",
}) => {
    return (
        <div className="mb-3">
            <label className={`form-label fw-semibold ${error ? "text-danger" : ""}`}>{label}</label>
            <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch" style={{ cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        className={`form-check-input ${error ? "is-invalid" : ""}`}
                        name={name}
                        checked={isActive}
                        onChange={() => onChange(!isActive)}
                        role="switch"
                        style={{
                            width: "2.5rem",
                            height: "1.5rem",
                            backgroundColor: isActive ? "#000" : "#ccc",
                            borderColor: isActive ? "#000" : "#ccc",
                        }}
                    />
                </div>
            </div>
            {error && <div className="invalid-feedback d-block">{errorMessage}</div>}
        </div>
    );
};

export default RadioToggle;
