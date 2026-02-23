"use client";

import React from "react";
import { FileText, CheckCircle, AlertCircle, Send, Shield } from "lucide-react";

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
    
    // Check for specific statuses first
    if (statusLower.includes("customer")) {
      return {
        icon: <Send size={18} />,
        bgColor: "bg-purple-50/50",
        borderColor: "border-purple-100",
        accentColor: "text-purple-600",
        label: "Send to Customer",
        order: 1,
      };
    } else if (statusLower.includes("insurance")) {
      return {
        icon: <Shield size={18} />,
        bgColor: "bg-cyan-50/50",
        borderColor: "border-cyan-100",
        accentColor: "text-cyan-600",
        label: "Sent to Insurance",
        order: 2,
      };
    } else if (statusLower.includes("admin")) {
      return {
        icon: <FileText size={18} />,
        bgColor: "bg-blue-50/50",
        borderColor: "border-blue-100",
        accentColor: "text-blue-600",
        label: "Sent to Admin",
        order: 3,
      };
    } else if (statusLower.includes("approved") || statusLower.includes("approve")) {
      return {
        icon: <CheckCircle size={18} />,
        bgColor: "bg-green-50/50",
        borderColor: "border-green-100",
        accentColor: "text-green-600",
        label: "Approved",
        order: 4,
      };
    } else if (statusLower.includes("draft")) {
      return {
        icon: <FileText size={18} />,
        bgColor: "bg-gray-50/50",
        borderColor: "border-gray-100",
        accentColor: "text-slate-600",
        label: "Draft",
        order: 5,
      };
    } else if (statusLower.includes("reject")) {
      return {
        icon: <AlertCircle size={18} />,
        bgColor: "bg-red-50/50",
        borderColor: "border-red-100",
        accentColor: "text-red-600",
        label: "Rejected",
        order: 6,
      };
    }
    
    return {
      icon: <FileText size={18} />,
      bgColor: "bg-gray-50/50",
      borderColor: "border-gray-100",
      accentColor: "text-gray-600",
      label: status,
      order: 7,
    };
  };

  // Define the desired order of cards
  const desiredOrder = [
    "Send to Customer",
    "Sent to Insurance",
    "Sent to Admin",
    "Approved",
    "Draft",
    "Rejected"
  ];
  
  // Create a map of status counts
  const statusMap = new Map(
    statusCounts.map(item => [getStatusConfig(item.status).label, item.count])
  );
  
  // Build ordered cards array
  const orderedCards = desiredOrder.map(label => ({
    status: label,
    count: statusMap.get(label) || 0,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 mb-6">
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
      {orderedCards.map((item, index) => {
        const config = getStatusConfig(item.status);
        return (
          <div
            key={index}
            onClick={() => onFilterByStatus(item.status)}
            className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200 animate-card`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Icon and Label in one line */}
            <div className={`flex items-center gap-1.5 mb-1.5 ${config.accentColor}`}>
              {config.icon}
              <span className="text-xs font-semibold whitespace-nowrap truncate flex-1">
                {config.label}
              </span>
            </div>

            {/* Count */}
            <div>
              <p className={`text-xl font-bold ${config.accentColor}`}>
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