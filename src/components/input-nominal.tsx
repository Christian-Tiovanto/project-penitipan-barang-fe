import { ChangeEventHandler } from "react";

export default function InputNominal({
  title,
  nominal,
  handleNominalChange,
}: {
  title: string;
  nominal: number;
  handleNominalChange: ChangeEventHandler;
}) {
  return (
    <div className="form-floating rounded-top mt-2 border-bottom border-dark">
      <input
        type="number"
        className="form-control third-bg rounded-0 text-center"
        id="cashflow-total"
        value={nominal}
        onChange={handleNominalChange}
        onKeyDown={(e) => {
          if (e.key === "-") e.preventDefault();
        }}
        min="0"
      />
      <label htmlFor="cashflow-total">{title}</label>
    </div>
  );
}
