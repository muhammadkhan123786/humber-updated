"use client";

import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditDisabled?: boolean;
  isDeleteDisabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onView,
  onEdit,
  onDelete,
  isEditDisabled = false,
  isDeleteDisabled = false,
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
        disabled={isEditDisabled}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium border rounded-lg h-8 transition-colors ${
          isEditDisabled
            ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
            : "text-indigo-600 border-indigo-300 bg-[#f8f9ff] hover:bg-indigo-100"
        }`}
        aria-label="Edit"
        title={isEditDisabled ? "Approved quotations cannot be edited" : "Edit"}
      >
        <Edit size={16} />
        <span>Edit</span>
      </button>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        disabled={isDeleteDisabled}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium border rounded-lg h-8 transition-colors ${
          isDeleteDisabled
            ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
            : "text-red-600 border-red-300 bg-red-50 hover:bg-red-100"
        }`}
        aria-label="Delete"
        title={isDeleteDisabled ? "Approved quotations cannot be deleted" : "Delete"}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default ActionButtons;
