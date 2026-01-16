import React from "react";
import {
  User,
  Building2,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  SquarePen,
  Trash2,
  Check,
  LucideIcon,
} from "lucide-react";

export type CustomerType = "Individual" | "Company" | "Government";

export interface CustomerCardProps {
  name: string;
  id: string;
  type: CustomerType;
  status: "Active" | "Inactive";
  email: string;
  phone: string;
  address: string;
  registeredDate: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const InfoRow = ({
  icon: Icon,
  text,
  bgColor,
  iconColor,
}: {
  icon: LucideIcon;
  text: string;
  bgColor: string;
  iconColor: string;
}) => (
  <div
    className={`${bgColor} flex items-center gap-3 p-3.5 rounded-2xl transition-all hover:opacity-80`}
  >
    <Icon size={18} className={iconColor} />
    <span className="text-slate-600 text-[13px] font-semibold truncate">
      {text}
    </span>
  </div>
);

const ActionButton = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#EEF2FF] rounded-2xl text-slate-700 text-sm font-bold hover:bg-slate-50 hover:border-indigo-200 transition-all active:scale-95 shadow-sm"
  >
    <Icon size={18} className="text-[#4F46E5]" /> {label}
  </button>
);

const CustomerCard: React.FC<CustomerCardProps> = ({
  name,
  id,
  type,
  status,
  email,
  phone,
  address,
  registeredDate,
  onEdit,
  onDelete,
}) => {
  const typeConfig: Record<
    CustomerType,
    { bg: string; icon: LucideIcon; label: string }
  > = {
    Individual: { bg: "bg-[#00A3FF]", icon: User, label: "Individual" },
    Company: { bg: "bg-[#E11DBC]", icon: Building2, label: "Company" },
    Government: { bg: "bg-[#00C853]", icon: ShieldCheck, label: "Government" },
  };

  const currentType = typeConfig[type];

  return (
    <div className="relative bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 w-full max-w-[400px] overflow-hidden">
      <div className="h-1.5 w-full bg-linear-to-r from-[#4F46E5] via-[#E11DBC] to-[#FB7185]" />

      <div className="p-8">
        {/* Header: Profile Icon & Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-purple-100">
            <User size={32} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
              {name}
            </h3>
            <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md w-fit mt-1 uppercase tracking-wider">
              {id}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div
            className={`${currentType.bg} text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-sm`}
          >
            <currentType.icon size={14} strokeWidth={2.5} />
            {currentType.label}
          </div>
          <div className="bg-[#00D169] text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm">
            <Check size={14} strokeWidth={4} />
            {status}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <InfoRow
            icon={Mail}
            text={email}
            bgColor="bg-[#F0F9FF]"
            iconColor="text-[#00A3FF]"
          />
          <InfoRow
            icon={Phone}
            text={phone}
            bgColor="bg-[#FFF1FA]"
            iconColor="text-[#E11DBC]"
          />
          <InfoRow
            icon={MapPin}
            text={address}
            bgColor="bg-[#F0FFF7]"
            iconColor="text-[#00C853]"
          />
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs mb-8 font-bold">
          <Calendar size={14} />
          <span>Registered: {registeredDate}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <ActionButton icon={SquarePen} label="Edit" onClick={onEdit} />
          <ActionButton icon={Trash2} label="Delete" onClick={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
