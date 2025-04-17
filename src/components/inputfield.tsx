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
      <label className={`form-label fw-semibold ${error ? "text-danger" : ""}`}>
        {label}
      </label>
      <div className="input-group shadow-sm">
        {icon && (
          <span className={`input-group-text ${error ? "text-danger" : ""}`}>
            {icon}
          </span>
        )}
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

export default InputField;
