import { CheckCircle2, XCircle } from "lucide-react";

export const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
    isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
  }`}>
    {isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
    {isActive ? "ACTIVE" : "INACTIVE"}
  </span>
);