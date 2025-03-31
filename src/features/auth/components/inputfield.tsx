import React from "react";
import { FaLock } from "react-icons/fa";

interface InputFieldLoginProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
    error?: string;
}

const InputFieldLogin: React.FC<InputFieldLoginProps> = ({ type, placeholder, value, onChange, icon, error }) => {
    return (
        <div>
            <div className="position-relative">
                <input
                    type={type}
                    className="form-control form-control-lg border-secondary shadow-none pe-5 rounded-0 border-2"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required
                />
                {icon && (
                    <span
                        className="position-absolute top-50 end-0 translate-middle-y text-muted d-flex align-items-center"
                        style={{ fontSize: '1.3rem', paddingRight: '10px' }}
                    >
                        {icon}
                    </span>
                )}
            </div>
            {error && <div className="text-danger mt-1">{error}</div>}
        </div>
    );
};

interface InputFieldProps {
    label: string;
    type?: string;
    name?: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: boolean;
    errorMessage?: string;
    icon?: React.ReactNode;
    readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    onBlur,
    error = false,
    errorMessage = "",
    icon,
    readOnly = false,
}) => {
    return (
        <div className="mb-3">
            <label className={`form-label fw-semibold ${error ? "text-danger" : ""}`}>{label}</label>
            <div className="input-group shadow-sm">
                {icon && <span className={`input-group-text ${error ? "text-danger" : ""}`}>{icon}</span>}
                <input
                    type={type}
                    className={`form-control ${error ? "is-invalid border-danger" : ""}`}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    readOnly={readOnly}
                />
                {error && <div className="invalid-feedback">{errorMessage}</div>}
            </div>
        </div>
    );
};

interface DropdownProps {
    label: string;
    name?: string;
    value: string;
    options: { value: string; label: string }[];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
    error?: boolean;
    errorMessage?: string;
    icon?: React.ReactNode;
    readOnly?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
    label,
    name,
    value,
    options,
    onChange,
    onBlur,
    error = false,
    errorMessage = "",
    icon,
    readOnly = false,
}) => {
    return (
        <div className="mb-3">
            <label className={`form-label fw-semibold ${error ? "text-danger" : ""}`}>{label}</label>
            <div className="input-group shadow-sm">
                {icon && <span className={`input-group-text ${error ? "text-danger" : ""}`}>{icon}</span>}
                <select
                    className={`form-select ${error ? "is-invalid border-danger" : ""}`}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={readOnly}
                >
                    <option value="" disabled>Select one</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <div className="invalid-feedback">{errorMessage}</div>}
            </div>
        </div>
    );
};

export default Dropdown;

// interface PasswordFieldProps {
//     label: string;
//     name: string;
//     value: string;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     error: boolean;
// }

// const PasswordField: React.FC<PasswordFieldProps> = ({ label, name, value, onChange, error }) => {
//     return (
//         <div className="mb-3">
//             <label className="form-label text-danger">{label} *</label>
//             <div className="input-group">
//                 <span className="input-group-text text-danger">
//                     <FaLock />
//                 </span>
//                 <input
//                     type="password"
//                     className={`form-control ${error ? "is-invalid" : ""}`}
//                     name={name}
//                     value={value}
//                     onChange={onChange}
//                 />
//                 {error && <div className="invalid-feedback">This field is required</div>}
//             </div>
//         </div>
//     );
// };




export { InputFieldLogin, InputField, Dropdown };
