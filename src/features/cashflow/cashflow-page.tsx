import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import InputNominal from "../../components/input-nominal";
export default function CreateCashFlow() {
  const [cashflowType, setCashflowType] = useState(null);
  const [nominal, setNominal] = useState(0);
  const handleCashflowTypeChange = (event: any) => {
    setCashflowType(event.target.value);
  };

  const handleNominalChange = (event: any) => {
    const value = event.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setNominal(value);
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
                className="form-control gray rounded-0 rounded-top border-top border-start border-end"
                id="cashflow-desc"
                rows={3}
                placeholder="Descriptions"
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
              nominal={nominal}
              handleNominalChange={handleNominalChange}
            />
            <button
              type="button"
              className={`btn w-100 h-50 mt-3 ${
                nominal && cashflowType
                  ? "btn-success"
                  : "btn-secondary disabled"
              }`}
            >
              Simpan
            </button>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center flex-column">
            <h2>Kas Masuk / Kas Keluar</h2>
            <div className="container mt-4">
              <div className="row">
                <div className="col-6">17:21:20</div>
                <div className="col-6 text-end">+ 15.000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
