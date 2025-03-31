import { useState } from "react";
import DatePicker from "../../components/date-picker";
import PagePaginationComponent from "../../components/pagination.tsx";
import { Table, ColumnConfig } from "../../components/table-component.tsx";
import "./report.css";
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
  const columns: ColumnConfig<ITransactionInData>[] = [
    {
      key: "product",
      header: "Product",
      render: (data) => data.product.name,
    },
    {
      key: "customer",
      header: "Customer",
      render: (data) => data.customer.name,
      headerStyle: { paddingLeft: "24px" },
      cellStyle: { paddingLeft: "24px" },
    },
    {
      key: "qty",
      header: "Quantity",
      render: (data) => data.qty,
      headerStyle: { paddingLeft: "24px" },
      cellStyle: { paddingLeft: "24px" },
    },
    {
      key: "converted_qty",
      header: "Quantity (Kg)",
      render: (data) => data.converted_qty,
      headerStyle: { paddingLeft: "24px" },
      cellStyle: { paddingLeft: "24px" },
    },
    {
      key: "unit",
      header: "Unit",
      render: (data) => data.unit,
      headerStyle: { paddingLeft: "24px" },
      cellStyle: { paddingLeft: "24px" },
    },
  ];
  const columnWidths = ["30%", "20%", "20%", "20%", "10%"];
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
          <Table
            data={TransactionInData}
            columns={columns}
            columnWidths={columnWidths}
          />
          <PagePaginationComponent
            selectedPageSize={selectedPageSize}
            setSelectedPageSize={(data: string) => setSelectedPageSize(data)}
          />
        </div>
      </div>
    </>
  );
}
