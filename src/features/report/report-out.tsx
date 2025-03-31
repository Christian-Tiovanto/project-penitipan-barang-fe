import { useState } from "react";
import DatePicker from "../../components/date-picker";
import PagePaginationComponent from "../../components/pagination.tsx";
import "./report-in.css";
interface ITransactionOutData {
  product: {
    id: number;
    name: string;
  };
  customer: {
    id: number;
    name: string;
  };
  converted_qty: number;
  total_days: number;
}
export function ReportOutPage() {
  const [selectedPageSize, setSelectedPageSize] = useState("All");
  const TransactionOutData: ITransactionOutData[] = [
    {
      product: { id: 1, name: "Product Name" },
      customer: { id: 1, name: "Customer Name" },
      converted_qty: 500,
      total_days: 50,
    },
    {
      product: {
        id: 1,
        name: "Lorem ipsum dolor sit amet consectetur.",
      },
      customer: { id: 1, name: "Customer Name" },
      converted_qty: 1000,
      total_days: 5,
    },
  ];
  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-md-6 position-relative">
            <DatePicker
              id="tanggal-awal-masuk-barang"
              titleText="Tanggal Awal"
            />
          </div>
          <div className="col-md-6 position-relative">
            <DatePicker
              id="tanggal-akhir-masuk-barang"
              titleText="Tanggal Akhir"
            />
          </div>
        </div>
        <div className="product-in-list w-100 d-flex flex-column">
          <div className="table-container w-100">
            <table>
              <colgroup>
                <col width={"10%"} />
                <col width={"30%"} />
                <col width={"20%"} />
                <col width={"20%"} />
                <col width={"20%"} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ paddingLeft: "16px" }}>No</th>
                  {["Product", "Customer", "Quantity (Kg)", "Total Days"].map(
                    (column) => (
                      <th style={{ paddingLeft: "24px" }} key={column}>
                        {column}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {TransactionOutData.map((value, index) => (
                  <tr>
                    <td style={{ paddingLeft: "16px" }}>{index + 1}</td>
                    <td style={{ paddingLeft: "24px" }}>
                      {value.product.name}
                    </td>
                    <td style={{ paddingLeft: "24px" }}>
                      {value.customer.name}
                    </td>
                    <td style={{ paddingLeft: "24px" }}>
                      {value.converted_qty}
                    </td>
                    <td style={{ paddingLeft: "24px" }}>{value.total_days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PagePaginationComponent
            selectedPageSize={selectedPageSize}
            setSelectedPageSize={(data: string) => setSelectedPageSize(data)}
          />
        </div>
      </div>
    </>
  );
}
