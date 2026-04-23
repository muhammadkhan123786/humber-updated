export interface Category {
  id: string;
  title: string;
  icon: string;
  desc: string;
  grad: string;
  gradLight: string;
  accent: string;
  accentLight: string;
  accentBorder: string;
  accentText: string;
  glow: string;
  tabs: Tab[];
  chartColors: string[];
}

export interface Tab {
  label: string;
  icon: string;
}

export interface Kpi {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: string;
  sparkline: number[];
}

export interface ChartData {
  name: string;
  [key: string]: number | string;
}

export interface CategoryData {
  kpis: Kpi[];
  chart: ChartData[];
  headers: string[];
  rows: (string | number)[][];
}

export interface StatusStyle {
  bg: string;
  color: string;
  dot: string;
}

export type StatusStyles = Record<string, StatusStyle>;

// types/index.ts
export interface Category {
  id: string;
  title: string;
  icon: string;
  desc: string;
  grad: string;
  gradLight: string;
  accent: string;
  accentLight: string;
  accentBorder: string;
  accentText: string;
  glow: string;
  tabs: { label: string; icon: string }[];
  chartColors: string[];
}

export interface KPI {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: string;
  sparkline: number[];
}


export interface CategoryData {
  kpis: KPI[];
  chart: ChartData[];
  headers: string[];
  rows: (string | number)[][];
}