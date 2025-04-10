export interface PaginationMetaData<T> {
  meta: {
    total_count: number;
    total_page: number;
    page_no: number;
    page_size: number;
  };
  data: T[];
}
