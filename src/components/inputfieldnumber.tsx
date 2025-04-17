interface InputFieldNumberProps {
  label: string;
  name: string;
  value: number;
  onChange?: (value: number) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  readOnly?: boolean;
}

const InputFieldNumber: React.FC<InputFieldNumberProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error = false,
  errorMessage = "",
  icon,
  readOnly = false,
}) => {
  // const handleIncrement = () => {
  //     if (onChange) {
  //         onChange(value + 1);
  //     }
  // };

  // const handleDecrement = () => {
  //     if (onChange) {
  //         onChange(value - 1);
  //     }
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Menghindari input seperti "01", "007", dsb., kecuali 0 itu sendiri
    const cleanedValue = rawValue === "" ? "" : String(Number(rawValue));
    if (onChange && cleanedValue !== "") {
      onChange(Number(cleanedValue));
    } else if (cleanedValue === "") {
      onChange?.(0); // Default ke 0 jika kosong
    }
  };

  return (
    <div className="mb-3">
      <label className={`form-label fw-semibold ${error ? "text-danger" : ""}`}>
        {label}
      </label>
      <div className="input-group shadow-sm">
        {icon && <span className="input-group-text">{icon}</span>}
        <input
          type="number"
          name={name}
          className={`form-control ${error ? "is-invalid border-danger" : ""}`}
          value={value === 0 ? "0" : String(Number(value))}
          onChange={handleChange}
          onBlur={onBlur}
          readOnly={readOnly}
          inputMode="numeric"
        />
        {error && <div className="invalid-feedback">{errorMessage}</div>}
      </div>
    </div>
  );
};

{
  /* <InputFieldNumber
label="Price *"
name="price"
value={form.price}  // pastikan ini number
onChange={handlePriceChange}
onBlur={handleBlur}
error={!!errors.price}
errorMessage={errors.price}
icon={<FaUser />}
/> */
}

// const handlePriceChange = (newValue: number) => {
//     setForm({
//         ...form,
//         price: newValue, // Mengupdate price dengan nilai number
//     });
// };

export default InputFieldNumber;
