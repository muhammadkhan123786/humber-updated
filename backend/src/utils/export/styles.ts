import { ModuleType } from "./ExportOptions";

export interface ReportStyle {
  primary: string;
  light: string;
  text: string;
}

export const REPORT_STYLES: Record<ModuleType, ReportStyle> = {
  inventory: {
    primary: "#059669",
    light: "#ecfdf5",
    text: "#065f46",
  },
  purchase: {
    primary: "#2563eb",
    light: "#eff6ff",
    text: "#1e40af",
  },
  supplier: {
    primary: "#7c3aed",
    light: "#f5f3ff",
    text: "#4c1d95",
  },
  financial: {
    primary: "#d97706",
    light: "#fffbeb",
    text: "#78350f",
  },
};