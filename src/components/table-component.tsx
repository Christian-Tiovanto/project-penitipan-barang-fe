// TableComponent.tsx
import React from "react";
import "./../features/report/report.css";

export interface ColumnConfig<T> {
  key: string;
  header: string;
  render: (data: T) => React.ReactNode;
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
}

interface TableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  columnWidths?: string[];
}

export const Table = <T,>({ data, columns, columnWidths }: TableProps<T>) => {
  return (
    <div className="table-container w-100">
      <table>
        {columnWidths && (
          <colgroup>
            {columnWidths.map((width, index) => (
              <col key={index} width={width} />
            ))}
          </colgroup>
        )}

        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={column.headerStyle}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} style={column.cellStyle}>
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
