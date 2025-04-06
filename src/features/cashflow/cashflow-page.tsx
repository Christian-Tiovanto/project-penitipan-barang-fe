import { FormEvent, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import InputNominal from "../../components/input-nominal";
import { CashflowService } from "./services/cashflow.service";
import { useToast } from "../../contexts/toastContexts";
import { useCashflowHistory } from "./hooks/cashflow.hooks";
import { startOfToday, startOfTomorrow, format } from "date-fns";

export interface ICashflowHistory {
  created_at: Date;
  type: "in" | "out";
  amount: number;
  descriptions: string;
}

export interface CreateCashflowDto {
  type: "in" | "out";
  amount: number;
  descriptions?: string;
}
export default function CreateCashFlow() {
  const [cashflowType, setCashflowType] = useState(null);
  const [amount, setAmount] = useState("0");
  const [descriptions, setDescriptions] = useState(undefined);
  const [startDate] = useState(startOfToday());
  const [endDate] = useState(startOfTomorrow());
  const { showToast } = useToast();
  const { data, isLoading } = useCashflowHistory({
    startDate,
    endDate,
  });

  const handleCashflowTypeChange = (event: any) => {
    setCashflowType(event.target.value);
  };
  const handleNominalChange = (event: any) => {
    const value = event.target.value;

    // Allow only digits (including empty string)
    if (/^\d*$/.test(value)) {
      let processedValue = value;

      // Remove leading zeros if the value has multiple digits
      if (processedValue.length > 1) {
        processedValue = processedValue.replace(/^0+/, "");
      }

      // Ensure the value isn't empty (default to "0")
      if (processedValue === "") {
        processedValue = "0";
      }

      setAmount(processedValue);
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!cashflowType || !amount) {
      return;
    } else {
      try {
        const createCashflowDto: CreateCashflowDto = {
          type: cashflowType,
          amount: parseFloat(amount),
        };
        if (descriptions) createCashflowDto.descriptions = descriptions;
        const response = await new CashflowService().createCashflow(
          createCashflowDto
        );
        if (response?.status === 201) {
          showToast("Data created successfully", "success");
        }
      } catch (error: any) {
        const finalMessage = `Failed to create Cashflow.\n${
          error?.response?.data?.message || error?.message || "Unknown error"
        }`;
        showToast(finalMessage, "danger");
      }
    }
  };
  return (
    <>
      <nav
        className="navbar-cashflow fixed-top m-0 p-0 d-flex justify-content-center align-items-center cyan"
        style={{
          maxHeight: "48px",
        }}
      >
        <div className="container-fluid d-flex justify-content-start gap-3 px-2">
          <button className="fs-1 border-0 text-white bg-transparent d-flex justify-content-center align-items-center">
            <IoCloseSharp />
          </button>
          <a
            className="navbar-brand text-white d-flex justify-content-center align-items-center"
            style={{
              fontSize: "20px",
              fontWeight: "500",
              letterSpacing: ".02em",
            }}
            href="#"
          >
            Kas
          </a>
        </div>
      </nav>
      <div className="container" style={{ marginTop: "68px" }}>
        <div className="row align-items-start">
          <div className="col-12 col-md-6 mb-5">
            <div className="form-floating rounded-top border-bottom border-dark">
              <textarea
                className="form-control third-bg rounded-0 rounded-top border-top border-start border-end"
                id="cashflow-desc"
                rows={3}
                placeholder="Descriptions"
                value={descriptions}
                onChange={(event: any) => {
                  setDescriptions(event.target.value);
                }}
              />
              <label htmlFor="cashflow-desc">Descriptions</label>
            </div>
            <div className="container">
              <div className="form-check form-check-inline me-3">
                <input
                  className="form-check-input me-3"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  value="in"
                  checked={cashflowType == "in"}
                  onChange={handleCashflowTypeChange}
                  style={{ transform: "scale(1.5", border: "2px solid grey" }}
                />
                <label
                  className="form-check-label gray-text"
                  htmlFor="inlineRadio1"
                >
                  Kas Masuk
                </label>
              </div>
              <div className="form-check form-check-inline mt-5">
                <input
                  className="form-check-input me-3"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio2"
                  value="out"
                  checked={cashflowType == "out"}
                  onChange={handleCashflowTypeChange}
                  style={{ transform: "scale(1.5", border: "2px solid grey" }}
                />
                <label
                  className="form-check-label gray-text"
                  htmlFor="inlineRadio2"
                >
                  Kas Keluar
                </label>
              </div>
            </div>
            <InputNominal
              title="Nominal *"
              nominal={parseFloat(amount)}
              handleNominalChange={handleNominalChange}
            />
            <button
              type="button"
              className={`btn w-100 h-50 mt-3 ${
                amount && cashflowType
                  ? "btn-success"
                  : "btn-secondary disabled"
              }`}
              onClick={handleSubmit}
            >
              Simpan
            </button>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center flex-column">
            <h2>Kas Masuk / Kas Keluar</h2>
            <div className="container mt-4">
              {data.map((value: ICashflowHistory, index) => (
                <div className="row" key={index}>
                  <div className="col-4">
                    {format(
                      new Date(value.created_at).toISOString(),
                      "HH:mm:ss"
                    )}
                  </div>
                  <div className="col-4">{value.descriptions}</div>
                  <div
                    className={`col-4 text-end ${
                      value.type === "in" ? "text-success" : "text-danger"
                    }`}
                  >{`${value.type === "in" ? "+" : "-"} ${value.amount}`}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
