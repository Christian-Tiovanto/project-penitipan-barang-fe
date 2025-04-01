export interface ColumnConfig<T> {
  field: keyof T;
  headerName: string;
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
}
