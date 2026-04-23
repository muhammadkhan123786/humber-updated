// components/common/DateRangePicker.tsx
"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

interface DateRangePickerProps {
  value: { start: string; end: string };
  onChange: (range: { start: string; end: string }) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { label: "Today", getValue: () => ({ start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] }) },
    { label: "Last 7 Days", getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
    }},
    { label: "Last 30 Days", getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
    }},
    { label: "This Month", getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
    }},
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    onChange(preset.getValue());
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          fontSize: 12,
          cursor: "pointer"
        }}
      >
        <Calendar size={14} />
        <span>{value.start} - {value.end}</span>
        <ChevronDown size={12} />
      </button>
      
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          marginTop: 8,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          border: "1px solid #e2e8f0",
          zIndex: 20,
          width: 260,
          padding: 12
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>Quick Select</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {presets.map(preset => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                style={{
                  padding: "6px 12px",
                  fontSize: 12,
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  color: "#334155"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #e2e8f0", margin: "10px 0 8px" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="date"
              value={value.start}
              onChange={(e) => onChange({ ...value, start: e.target.value })}
              style={{ flex: 1, padding: "6px 8px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 6 }}
            />
            <input
              type="date"
              value={value.end}
              onChange={(e) => onChange({ ...value, end: e.target.value })}
              style={{ flex: 1, padding: "6px 8px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 6 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}