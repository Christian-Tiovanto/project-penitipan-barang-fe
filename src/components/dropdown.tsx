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
                    style={{
                        maxHeight: '200px',  // Menentukan tinggi maksimal dropdown
                        overflowY: 'auto',   // Mengaktifkan scroll vertikal
                    }}
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