// components/common/ExportButton.tsx
"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, FileJson, Printer, Check, Copy } from "lucide-react";

interface ExportButtonProps {
  onExportCSV: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
  onCopy: () => void;
}

export function ExportButton({ onExportCSV, onExportExcel, onExportPDF, onPrint, onCopy }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 16px",
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          border: "none",
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 600,
          color: "#fff",
          cursor: "pointer"
        }}
      >
        <Download size={14} />
        Export
      </button>
      
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: 8,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          border: "1px solid #e2e8f0",
          zIndex: 20,
          minWidth: 180,
          overflow: "hidden"
        }}>
          <button
            onClick={() => { onExportCSV(); setIsOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "#334155" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <FileText size={14} style={{ color: "#059669" }} /> CSV
          </button>
          <button
            onClick={() => { onExportExcel(); setIsOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "#334155" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <FileSpreadsheet size={14} style={{ color: "#16a34a" }} /> Excel
          </button>
          <button
            onClick={() => { onExportPDF(); setIsOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "#334155" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <FileJson size={14} style={{ color: "#dc2626" }} /> PDF
          </button>
          <button
            onClick={() => { onPrint(); setIsOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "#334155" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <Printer size={14} style={{ color: "#7c3aed" }} /> Print
          </button>
          <div style={{ borderTop: "1px solid #e2e8f0", margin: "4px 0" }} />
          <button
            onClick={handleCopy}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "#334155" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <Copy size={14} style={{ color: "#64748b" }} /> {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}