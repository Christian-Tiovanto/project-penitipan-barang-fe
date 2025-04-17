import { useState, useEffect, ChangeEventHandler } from "react";

interface InputNominalProps {
  title: string;
  nominal: number;
  onNominalChange: (value: number) => void;
}

export default function InputNominal({
  title,
  nominal,
  onNominalChange,
}: InputNominalProps) {
  const [inputValue, setInputValue] = useState("");

  // Format as an integer with thousand separators (de-DE locale)
  useEffect(() => {
    const formatted = new Intl.NumberFormat("de-DE", {
      maximumFractionDigits: 0,
    }).format(nominal);
    setInputValue(formatted);
  }, [nominal]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const rawValue = event.target.value;

    // Remove thousand separators and allow only digits
    const processed = rawValue.replace(/\./g, "").replace(/[^0-9]/g, "");

    // Default to "0" if empty
    const sanitized = processed === "" ? "0" : processed;
    const numericValue = parseInt(sanitized, 10);

    // Format with thousand separators using de-DE style
    const formattedValue = new Intl.NumberFormat("de-DE", {
      maximumFractionDigits: 0,
    }).format(numericValue);

    setInputValue(formattedValue);
    onNominalChange(numericValue);
  };

  return (
    <div className="form-floating rounded-top border-bottom border-dark">
      <input
        type="text"
        className="form-control third-bg rounded-0 text-center"
        id="cashflow-total"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={(e) => {
          // Allow control keys for navigation and editing
          const controlKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Tab",
            "Home",
            "End",
          ];

          if (
            controlKeys.includes(e.key) ||
            /[0-9]/.test(e.key) ||
            e.ctrlKey ||
            e.metaKey
          ) {
            // Allow key events as long as they're digit or control keys.
            return;
          } else {
            // Prevent any other key (e.g., comma, dot, letters)
            e.preventDefault();
          }
        }}
      />
      <label htmlFor="cashflow-total">{title}</label>
    </div>
  );
}
