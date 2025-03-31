import { useState } from "react";
import DatePicker from "../../components/date-picker";
import PagePaginationComponent from "../../components/pagination.tsx";
import "./report-in.css";
interface ITransactionInData {
  product: {
    id: number;
    name: string;
  };
  customer: {
    id: number;
    name: string;
  };
  qty: number;
  converted_qty: number;
  unit: string;
}
export function ReportInPage() {
  const [selectedPageSize, setSelectedPageSize] = useState("All");
  const TransactionInData: ITransactionInData[] = [
    {
      product: { id: 1, name: "Product Name" },
      customer: { id: 1, name: "Customer Name" },
      qty: 5,
      converted_qty: 500,
      unit: "Kg",
    },
    {
      product: {
        id: 1,
        name: "Lorem ipsum dolor sit amet consectetur.",
      },
      customer: { id: 1, name: "Customer Name" },
      qty: 5,
      converted_qty: 500,
      unit: "Kg",
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
                <col width={"30%"} />
                <col width={"20%"} />
                <col width={"20%"} />
                <col width={"20%"} />
                <col width={"10%"} />
              </colgroup>
              <thead>
                <tr>
                  <th>Product</th>
                  {["Customer", "Quantity", "Quantity (Kg)", "Unit"].map(
                    (column) => (
                      <th style={{ paddingLeft: "24px" }} key={column}>
                        {column}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {TransactionInData.map((value, index) => (
                  <tr>
                    <td>{value.product.name}</td>
                    <td style={{ paddingLeft: "24px" }}>
                      {value.customer.name}
                    </td>
                    <td style={{ paddingLeft: "24px" }}>{value.qty}</td>
                    <td style={{ paddingLeft: "24px" }}>
                      {value.converted_qty}
                    </td>
                    <td style={{ paddingLeft: "24px" }}>{value.unit}</td>
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
