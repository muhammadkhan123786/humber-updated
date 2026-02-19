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
        icon: <FileText size={18} />,
        bgColor: "bg-blue-50/50",
        borderColor: "border-blue-100",
        accentColor: "text-blue-600",
        label: "Sent",
      };
    } else if (
      statusLower.includes("approved") ||
      statusLower.includes("approve")
    ) {
      return {
        icon: <CheckCircle size={18} />,
        bgColor: "bg-green-50/50",
        borderColor: "border-green-100",
        accentColor: "text-green-600",
        label: "Approved",
      };
    } else if (statusLower.includes("draft")) {
      return {
        icon: <FileText size={18} />,
        bgColor: "bg-gray-50/50",
        borderColor: "border-gray-100",
        accentColor: "text-slate-600",
        label: "Draft",
      };
    } else if (statusLower.includes("reject")) {
      return {
        icon: <AlertCircle size={18} />,
        bgColor: "bg-red-50/50",
        borderColor: "border-red-100",
        accentColor: "text-red-600",
        label: "Rejected",
      };
    }

    return {
      icon: <FileText size={18} />,
      bgColor: "bg-gray-50/50",
      borderColor: "border-gray-100",
      accentColor: "text-gray-600",
      label: status,
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-card {
          animation: scaleIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      {statusCounts.map((item, index) => {
        const config = getStatusConfig(item.status);
        return (
          <div
            key={index}
            onClick={() => onFilterByStatus(item.status)}
            className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200 animate-card`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Header: Icon and Label side-by-side */}
            <div
              className={`flex items-center gap-2 mb-3  ${config.accentColor}`}
            >
              {config.icon}
              <span className="text-sm font-semibold">{config.label}</span>
            </div>

            {/* Content: Number on next line */}
            <div>
              <p className={`text-3xl font-bold ${config.accentColor}`}>
                {item.count}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
