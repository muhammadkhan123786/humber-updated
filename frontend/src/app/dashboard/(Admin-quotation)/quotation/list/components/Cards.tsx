"use client";

import React from "react";
import { FileText, CheckCircle, XCircle, Send, Shield } from "lucide-react";

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

    if (
      statusLower.includes("send to customer") ||
      statusLower.includes("customer")
    ) {
      return {
        icon: <Send size={18} />,
        bgColor: "bg-blue-50/50",
        borderColor: "border-blue-200",
        accentColor: "text-blue-600",
        hoverColor: "hover:bg-blue-100",
        label: "Send to Customer",
        fullStatus: "SEND TO CUSTOMER",
      };
    }
    // SEND TO INSURANCE
    else if (
      statusLower.includes("send to insurance") ||
      statusLower.includes("insurance")
    ) {
      return {
        icon: <Shield size={18} />,
        bgColor: "bg-purple-50/50",
        borderColor: "border-purple-200",
        accentColor: "text-purple-600",
        hoverColor: "hover:bg-purple-100",
        label: "Send to Insurance",
        fullStatus: "SEND TO INSURANCE",
      };
    }
    // APPROVED
    else if (
      statusLower.includes("approved") ||
      statusLower.includes("approve")
    ) {
      return {
        icon: <CheckCircle size={18} />,
        bgColor: "bg-green-50/50",
        borderColor: "border-green-200",
        accentColor: "text-green-600",
        hoverColor: "hover:bg-green-100",
        label: "Approved",
        fullStatus: "APPROVED",
      };
    }
    // REJECTED
    else if (statusLower.includes("reject")) {
      return {
        icon: <XCircle size={18} />,
        bgColor: "bg-red-50/50",
        borderColor: "border-red-200",
        accentColor: "text-red-600",
        hoverColor: "hover:bg-red-100",
        label: "Rejected",
        fullStatus: "REJECTED",
      };
    }
    // SENT TO ADMIN / Draft
    else if (
      statusLower.includes("sent to admin") ||
      statusLower.includes("draft")
    ) {
      return {
        icon: <FileText size={18} />,
        bgColor: "bg-gray-50/50",
        borderColor: "border-gray-200",
        accentColor: "text-gray-600",
        hoverColor: "hover:bg-gray-100",
        label: status,
        fullStatus: status,
      };
    }

    // Default
    return {
      icon: <FileText size={18} />,
      bgColor: "bg-gray-50/50",
      borderColor: "border-gray-200",
      accentColor: "text-gray-600",
      hoverColor: "hover:bg-gray-100",
      label: status,
      fullStatus: status,
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
            onClick={() => onFilterByStatus(config.fullStatus)}
            className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 cursor-pointer ${config.hoverColor} hover:shadow-md hover:scale-105 transition-all duration-200 animate-card`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div
              className={`flex items-center gap-2 mb-3 ${config.accentColor}`}
            >
              {config.icon}
              <span className="text-sm font-semibold">{config.label}</span>
            </div>
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
