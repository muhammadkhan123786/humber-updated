
import { Edit, Trash2 } from "lucide-react";

interface ActionProps {
  onEdit: () => void;
  onDelete: () => void;
  isDefault?:boolean;
}

export const TableActionButton = ({ onEdit, onDelete }: ActionProps) => (
  <div className="flex justify-center gap-2">
    <button 
      onClick={onEdit} 
      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
      title="Edit"
    >
      <Edit size={18} />
    </button>
    <button 
      onClick={onDelete} 
      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
      title="Delete"
    >
      <Trash2 size={18} />
    </button>
  </div>
);