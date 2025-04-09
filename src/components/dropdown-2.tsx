import React, { useState, useEffect, useMemo } from "react";

interface DropdownProps {
  id: string;
  label: string;
  name?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  readOnly?: boolean;
}

const DropdownSecondStyle: React.FC<DropdownProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  error = false,
  errorMessage = "",
  icon,
  readOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [localError, setLocalError] = useState(false);

  useEffect(() => {
    const selectedOption = options.find((opt) => opt.value === value);
    setSearchTerm(selectedOption ? selectedOption.label : "");
  }, [value, options]);

  const filteredOptions = useMemo(() => {
    return isFiltering && searchTerm
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;
  }, [searchTerm, options, isFiltering]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsFiltering(true);
    setIsOpen(true);
    setLocalError(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
    setIsFiltering(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setIsOpen(false);
      if (!value) {
        setSearchTerm("");
        setLocalError(true);
      }
    }, 200);
  };

  const handleOptionClick = (option: { value: string; label: string }) => {
    setSearchTerm(option.label);
    onChange?.(option.value);
    setIsOpen(false);
    setIsFiltering(false);
    setLocalError(false);
  };

  return (
    <>
      <div className="select-container mb-2">
        <div className="container-fluid d-flex justify-content-start align-items-center ps-3">
          {icon}
          <div className="form-floating w-100">
            <input
              type="text"
              className={`form-control third-bg border-0 position-relative${
                error || localError ? "is-invalid border-danger" : ""
              }`}
              placeholder="Search..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClick={() => setIsOpen(true)}
              disabled={readOnly}
              style={{ paddingRight: "30px" }}
              aria-autocomplete="list"
            />
            {!readOnly && searchTerm && (
              <span
                className="position-absolute"
                style={{
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#999",
                }}
                onClick={() => {
                  setSearchTerm("");
                  onChange?.("");
                  setLocalError(true);
                }}
              >
                ✖
              </span>
            )}
            <label htmlFor={id} className="label">
              {label}
            </label>

            {/* {(error || localError) && (
                <div className="invalid-feedback d-block position-absolute m-0">
                  {errorMessage || "Please select an option."}
                </div>
              )} */}
            {isOpen && (
              <ul
                className="list-group position-absolute w-100 shadow-sm"
                style={{ maxHeight: "200px", overflowY: "auto", zIndex: 10 }}
              >
                {filteredOptions.length === 0 ? (
                  <li className="list-group-item">No options found</li>
                ) : (
                  filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      className="list-group-item list-group-item-action"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleOptionClick(option);
                      }}
                    >
                      {option.label}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DropdownSecondStyle;
