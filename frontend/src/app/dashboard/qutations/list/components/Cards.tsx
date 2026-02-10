"use client";

import React from "react";
import { FileText, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface StatusCount {
  status: string;
  count: number;
}

interface CardsProps {
  statusCounts: StatusCount[];
  onFilterByStatus: (status: string) => void;
}

const Cards: React.FC<CardsProps> = ({ statusCounts, onFilterByStatus }) => {
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes("sent") || statusLower.includes("send")) {
      return {
        icon: <FileText size={24} />,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        iconColor: "text-blue-600",
        countColor: "text-blue-700",
        label: "Sent",
      };
    } else if (statusLower.includes("approved") || statusLower.includes("approve")) {
      return {
        icon: <CheckCircle size={24} />,
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        iconColor: "text-green-600",
        countColor: "text-green-700",
        label: "Approved",
      };
    } else if (statusLower.includes("draft")) {
      return {
        icon: <AlertCircle size={24} />,
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        iconColor: "text-gray-600",
        countColor: "text-gray-700",
        label: "Draft",
      };
    } else if (statusLower.includes("reject")) {
      return {
        icon: <XCircle size={24} />,
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        iconColor: "text-red-600",
        countColor: "text-red-700",
        label: "Rejected",
      };
    }
    
    return {
      icon: <FileText size={24} />,
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      iconColor: "text-gray-600",
      countColor: "text-gray-700",
      label: status,
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statusCounts.map((item, index) => {
        const config = getStatusConfig(item.status);
        return (
          <div
            key={index}
            onClick={() => onFilterByStatus(item.status)}
            className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {config.label}
                </p>
                <p className={`text-3xl font-bold ${config.countColor}`}>
                  {item.count}
                </p>
              </div>
              <div className={`${config.iconColor}`}>{config.icon}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
