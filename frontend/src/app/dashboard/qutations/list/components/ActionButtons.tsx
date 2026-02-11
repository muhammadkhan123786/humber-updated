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
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        aria-label="View"
      >
        <Eye size={16} />
        <span>View</span>
      </button>

      {/* Edit Button */}
      <button
        onClick={onEdit}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        aria-label="Edit"
      >
        <Edit size={16} />
        <span>Edit</span>
      </button>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="flex items-center gap-1 p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        aria-label="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default ActionButtons;
