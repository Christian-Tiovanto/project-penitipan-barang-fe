import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerFieldProps {
  label: string;
  name?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  readOnly?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  name,
  value,
  onChange,
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
        <DatePicker
          selected={value}
          onChange={onChange}
          name={name}
          readOnly={readOnly}
          className={`form-control ${error ? "is-invalid border-danger" : ""}`}
          dateFormat="dd/MM/yyyy HH:mm"
          placeholderText="Pilih tanggal dan waktu"
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Waktu"
        />
        {error && (
          <div className="invalid-feedback d-block">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default DatePickerField;
