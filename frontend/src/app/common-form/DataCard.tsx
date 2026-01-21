"use client";
import React from "react";
import { StatusBadge } from "@/app/common-form/StatusBadge";
import { Trash2 } from "lucide-react";

interface CardDataProps<T> {
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  renderIcon: (index: number) => React.ReactNode;
  renderContent: (item: T) => React.ReactNode;
  getId: (item: T) => string;
  getIsActive: (item: T) => boolean;
  getIsDefault?: (item: T) => boolean;
}

const getIconGradient = (index: number) => {
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-green-400 to-emerald-600",
    "bg-gradient-to-br from-purple-400 to-pink-600",
    "bg-gradient-to-br from-orange-400 to-red-600",
  ];
  return gradients[index % gradients.length];
};

export function CardData<T>({
  data,
  onEdit,
  onDelete,
  onStatusChange,
  renderIcon,
  renderContent,
  getId,
  getIsActive,
  getIsDefault,
}: CardDataProps<T>) {
  if (data.length === 0) {
    return (
      <div className="col-span-full text-center py-20 text-gray-400">
        <div className="text-5xl mb-3">📭</div>
        <p>No records found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item, index) => (
        <div
          key={getId(item)}
          className="bg-white rounded-3xl border-2 border-blue-100 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 hover:scale-105 hover:-translate-y-2 cursor-pointer transform"
        >
          <div className="p-4 flex items-start justify-between">
            <div className={`${getIconGradient(index)} p-3 rounded-xl text-white shadow-lg`}>
              {renderIcon(index)}
            </div>
            <StatusBadge
              isActive={getIsActive(item)}
              onChange={(newStatus) => onStatusChange?.(getId(item), newStatus)}
              editable={!getIsDefault?.(item)}
            />
          </div>

          <div className="px-5 pb-5 space-y-4">
            {renderContent(item)}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onEdit(item)}
                className="flex-1 flex text-sm items-center justify-center gap-1 py-2 px-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold transition-all hover:text-blue-600 border border-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (getIsDefault?.(item)) {
                    alert("Default items cannot be deleted.");
                    return;
                  }
                  onDelete(getId(item));
                }}
                className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-gray-100"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}