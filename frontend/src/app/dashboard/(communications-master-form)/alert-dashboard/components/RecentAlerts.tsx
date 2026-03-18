"use client";
import React from "react";
import { FileText } from "lucide-react";

interface AlertRow {
  id: string;
  module: "Repair" | "Inventory" | "Service";
  type: string;
  priority: "High" | "Critical" | "Medium" | "Low";
  triggeredBy: string;
  assignedTo: string;
  status: "Active" | "Pending" | "Acknowledged" | "Escalated";
  timestamp: string;
}

const tableData: AlertRow[] = [
  {
    id: "ALR-001",
    module: "Repair",
    type: "Job Delayed",
    priority: "High",
    triggeredBy: "System",
    assignedTo: "John Smith",
    status: "Active",
    timestamp: "2 hours ago",
  },
  {
    id: "ALR-002",
    module: "Inventory",
    type: "Low Stock",
    priority: "Critical",
    triggeredBy: "Auto Trigger",
    assignedTo: "Sarah Wilson",
    status: "Pending",
    timestamp: "3 hours ago",
  },
  {
    id: "ALR-003",
    module: "Service",
    type: "Warranty Expiry",
    priority: "Medium",
    triggeredBy: "System",
    assignedTo: "Mike Johnson",
    status: "Acknowledged",
    timestamp: "5 hours ago",
  },
  {
    id: "ALR-004",
    module: "Repair",
    type: "Parts Awaiting",
    priority: "Low",
    triggeredBy: "Technician",
    assignedTo: "Emma Davis",
    status: "Active",
    timestamp: "6 hours ago",
  },
  {
    id: "ALR-005",
    module: "Inventory",
    type: "Stock Discrepancy",
    priority: "High",
    triggeredBy: "Warehouse",
    assignedTo: "Tom Brown",
    status: "Escalated",
    timestamp: "1 day ago",
  },
];

const RecentAlerts: React.FC = () => {
  const getModuleStyle = (module: string) => {
    const styles = {
      Repair: "bg-orange-50 text-orange-600 border-orange-100",
      Inventory: "bg-blue-50 text-blue-600 border-blue-100",
      Service: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };
    return styles[module as keyof typeof styles] || "";
  };

  const getPriorityStyle = (priority: string) => {
    const styles = {
      Critical: "bg-red-50 text-red-600 border-red-100",
      High: "bg-orange-50 text-orange-600 border-orange-100",
      Medium: "bg-yellow-50 text-yellow-600 border-yellow-100",
      Low: "bg-blue-50 text-blue-600 border-blue-100",
    };
    return styles[priority as keyof typeof styles] || "";
  };

  const getStatusStyle = (status: string) => {
    const styles = {
      Active: "bg-orange-50 text-orange-600 border-orange-100",
      Pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
      Acknowledged: "bg-blue-50 text-blue-600 border-blue-100",
      Escalated: "bg-red-50 text-red-600 border-red-100",
    };
    return styles[status as keyof typeof styles] || "";
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 w-full overflow-hidden">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-linear-to-br from-purple-500 to-pink-500 p-2 rounded-lg text-white">
          <FileText size={20} />
        </div>
        <h3 className="font-bold text-slate-800">Recent Alerts</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="py-4 px-4 font-semibold text-slate-700  tracking-wider">
                Alert ID
              </th>
              <th className="py-4 px-4 font-semibold text-slate-700  tracking-wider">
                Module
              </th>
              <th className="py-4 px-4  font-semibold text-slate-700  tracking-wider">
                Alert Type
              </th>
              <th className="py-4 px-4  font-semibold text-slate-700  tracking-wider">
                Priority
              </th>
              <th className="py-4 px-4  font-semibold text-slate-700  tracking-wider">
                Triggered By
              </th>
              <th className="py-4 px-4  font-semibold text-slate-700  tracking-wider">
                Assigned To
              </th>
              <th className="py-4 px-4 font-semibold text-slate-700  tracking-wider">
                Status
              </th>
              <th className="py-4 px-4 font-semibold text-slate-700  tracking-wider">
                Timestamp
              </th>
              <th className="py-4 px-4  font-semibold text-slate-700  tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0"
              >
                <td className="py-5 px-4 text-sm font-bold text-slate-700">
                  {row.id}
                </td>
                <td className="py-5 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getModuleStyle(row.module)}`}
                  >
                    {row.module}
                  </span>
                </td>
                <td className="py-5 px-4 text-sm text-slate-600">{row.type}</td>
                <td className="py-5 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getPriorityStyle(row.priority)}`}
                  >
                    {row.priority}
                  </span>
                </td>
                <td className="py-5 px-4 text-sm text-slate-600">
                  {row.triggeredBy}
                </td>
                <td className="py-5 px-4 text-sm text-slate-600 font-medium">
                  {row.assignedTo}
                </td>
                <td className="py-5 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(row.status)}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-5 px-4 text-sm text-slate-500">
                  {row.timestamp}
                </td>
                <td className="py-5 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="px-4 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
                      View
                    </button>
                    <button className="px-4 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-indigo-50 transition-all shadow-sm">
                      Acknowledge
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAlerts;
