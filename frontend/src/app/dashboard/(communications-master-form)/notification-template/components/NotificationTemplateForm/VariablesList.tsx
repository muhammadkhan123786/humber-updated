// components/NotificationTemplateForm/VariablesList.tsx
"use client";
import { Hash } from "lucide-react";
import { Variable } from "./types";

interface VariablesListProps {
  variables: Variable[];
  onInsert: (key: string) => void;
}

export const VariablesList: React.FC<VariablesListProps> = ({ variables, onInsert }) => {
  if (variables.length === 0) return null;

  return (
    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
      <label className="text-xs font-bold text-indigo-700 uppercase mb-3 block">
        Placeholders — click to insert at cursor
      </label>
      <div className="flex flex-wrap gap-2">
        {variables.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onInsert(v.key)}
            className="bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-mono transition-all shadow-sm flex items-center gap-1"
          >
            <Hash size={11} /> {`{{${v.key}}}`}
          </button>
        ))}
      </div>
    </div>
  );
};