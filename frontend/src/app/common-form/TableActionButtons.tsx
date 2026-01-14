
import { Edit, Trash2 } from "lucide-react";

interface ActionProps {
  onEdit: () => void;
  onDelete: () => void;
  isDefault?:boolean;
}

export const TableActionButton = ({ onEdit, onDelete }: ActionProps) => (
  <div className="flex justify-center gap-3">
    <button 
      onClick={onEdit} 
      className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-semibold"
      title="Edit"
    >
      <Edit size={18} /> Edit
    </button>
    <button 
      onClick={onDelete} 
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
      title="Delete"
    >
      <Trash2 size={18} />
    </button>
  </div>
);