"use client";

import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* View Button */}
      <button
        onClick={onView}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-300 bg-[#f8f9ff] rounded-lg h-8  hover:bg-indigo-100 transition-colors"
        aria-label="View"
      >
        <Eye size={16} />
        <span>View</span>
      </button>

      {/* Edit Button */}
      <button
        onClick={onEdit}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-300 bg-[#f8f9ff] rounded-lg h-8  hover:bg-indigo-100 transition-colors"
        aria-label="Edit"
      >
        <Edit size={16} />
        <span>Edit</span>
      </button>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-red-600 border border-red-300 bg-red-50 rounded-lg h-8  hover:bg-red-100 transition-colors"
        aria-label="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default ActionButtons;
