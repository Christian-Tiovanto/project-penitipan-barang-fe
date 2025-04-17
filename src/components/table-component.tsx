import { Order } from "../enum/SortOrder";

export interface ColumnConfig<T> {
  field: keyof T;
  headerName: string;
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
}

export interface HeadCell<T> {
  field: keyof T;
  headerName: string;
  headerStyle?: React.CSSProperties;
}
export interface EnhancedTableProps<T> {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  order: Order;
  orderBy: string;
}
