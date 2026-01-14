import { CheckCircle2, XCircle } from "lucide-react";

export const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <div className={`relative inline-flex items-center h-7 w-12 rounded-full transition-all cursor-pointer ${
    isActive ? 'bg-blue-500' : 'bg-gray-300'
  }`}>
    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
      isActive ? 'translate-x-6' : 'translate-x-1'
    }`}></div>
  </div>
);