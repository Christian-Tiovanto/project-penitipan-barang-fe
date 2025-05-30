import { FormEvent, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import InputNominal from "../../components/input-nominal";
import { CashflowService } from "./services/cashflow.service";
import { useToast } from "../../contexts/toastContexts";
import { useCashflowHistory } from "./hooks/cashflow.hooks";
import { startOfToday, startOfTomorrow, format } from "date-fns";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

  const [cashflowType, setCashflowType] = useState(null);
  const [amount, setAmount] = useState(0);
  const [descriptions, setDescriptions] = useState("");
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!cashflowType || !amount) {
      return;
    } else {
      try {
        const createCashflowDto: CreateCashflowDto = {
          type: cashflowType,
          amount: amount,
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
      } finally {
        setCashflowType(null);
        setAmount(0);
        setDescriptions("");
      }
    }
  };
  return (
    <>
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
                  Cash In
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
                  Cash Out
                </label>
              </div>
            </div>
            <InputNominal
              title="Nominal *"
              nominal={amount}
              onNominalChange={setAmount}
            />
            <button
              type="button"
              className={`btn w-100 h-50 mt-3 ${
                amount != 0 && cashflowType
                  ? "btn-success"
                  : "btn-secondary disabled"
              }`}
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center flex-column">
            <h2>Cash In / Cash Out</h2>
            <div className="container mt-4">
              {!isLoading &&
                data.map((value: ICashflowHistory, index) => (
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
                    >{`${value.type === "in" ? "+" : "-"} ${Number(
                      value.amount
                    ).toLocaleString("id-Id")}`}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
