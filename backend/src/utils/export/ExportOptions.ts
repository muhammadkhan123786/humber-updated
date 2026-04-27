export type ExportType = "pdf" | "excel" | "csv";

export type ModuleType = "inventory" | "purchase" | "supplier" | "financial";

export interface KPI {
  label: string;
  value: string | number;
}

export interface ReportTable {
  headers: string[];
  rows: (string | number)[][];
}

export interface ExportOptions {
  type: ExportType;
  module: ModuleType;
  title: string;
  kpis?: KPI[];
  table: ReportTable;
}