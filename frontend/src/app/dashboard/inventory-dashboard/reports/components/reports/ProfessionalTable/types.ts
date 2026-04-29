// components/reports/ProfessionalTable/types.ts
export interface TableFilter {
  field: string;
  label: string;
  type?: "text" | "date" | "number";
}

export interface StatusStyle {
  bg: string;
  color: string;
  dot: string;
}

export interface ProfessionalTableProps {
  headers: string[];
  rows: any[][];
  total: number | any;
  totalPages: number | any;
  page: number | any;
  rowsPerPage: number | any;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
  search: string | any;
  onSearchChange: (value: string) => void;
  columnFilters?: Record<string, string>;
  onColumnFilterChange?: (field: string, value: string) => void;
  onClearAllFilters?: () => void;
  statusStyles?: Record<string, StatusStyle>;
  accentColor?: string;
  accentLight?: string;
  dateRange?: { start: string; end: string };
  onDateRangeChange?: (start: string, end: string) => void;
  onExport?: (type: "csv" | "excel" | "pdf") => void;
  isExporting?: boolean;
  isFetching?: boolean;
  filtersConfig?: TableFilter[];

}