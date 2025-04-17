import { useState, useEffect, ChangeEventHandler } from "react";

interface InputNominalProps {
  title: string;
  nominal: number;
  onNominalChange: (value: number) => void;
}

export default function InputNominalDecimal({
  title,
  nominal,
  onNominalChange,
}: InputNominalProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const formatted = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 20,
    }).format(nominal);
    setInputValue(formatted);
  }, [nominal]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const rawValue = event.target.value;

    // Allow numbers and commas only
    const processed = rawValue
      .replace(/\./g, "") // Remove existing thousand separators
      .replace(/[^0-9,]/g, ""); // Remove non-numeric characters except comma

    // Split into integer and fractional parts
    const parts = processed.split(",");
    let integerPart = parts[0].replace(/^0+/, "") || "0";
    const fractionalPart = parts[1] || "";

    // Add thousand separators to integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Rebuild the formatted value with comma as decimal separator
    let newValue = integerPart;
    if (parts.length > 1) {
      newValue += `,${fractionalPart}`;
    }

    // Handle edge cases
    if (newValue === "") newValue = "0";
    if (newValue.startsWith(",")) newValue = `0${newValue}`;

    setInputValue(newValue);

    // Convert to numeric value (replace commas with dots for parsing)
    const numericValue = parseFloat(
      newValue.replace(/\./g, "").replace(/,/g, ".")
    );

    if (!isNaN(numericValue)) {
      onNominalChange(numericValue);
    }
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
            /[0-9,]/.test(e.key) ||
            e.ctrlKey ||
            e.metaKey
          ) {
            if (e.key === "," && inputValue.includes(",")) {
              e.preventDefault();
            }
          } else {
            e.preventDefault();
          }
        }}
      />
      <label htmlFor="cashflow-total">{title}</label>
    </div>
  );
}
