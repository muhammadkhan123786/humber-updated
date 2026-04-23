// components/reports/DateRangePicker.tsx
"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

interface DateRangePickerProps {
  value: { start: string; end: string };
  onChange: (range: { start: string; end: string }) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preset, setPreset] = useState("custom");

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
    { label: "Last Month", getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
    }},
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    const range = preset.getValue();
    onChange(range);
    setPreset(preset.label);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg text-sm hover:shadow-md transition-all"
      >
        <Calendar className="h-4 w-4 text-slate-500" />
        <span>{value.start} - {value.end}</span>
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-slate-200 z-20 w-80">
          <div className="p-4 border-b border-slate-100">
            <h4 className="font-medium text-slate-800 mb-2">Quick Select</h4>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className={`px-3 py-1.5 text-sm rounded-lg text-left transition-all ${
                    preset === p.label
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            <label className="text-sm text-slate-600 block mb-2">Custom Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={value.start}
                onChange={(e) => onChange({ ...value, start: e.target.value })}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={value.end}
                onChange={(e) => onChange({ ...value, end: e.target.value })}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}