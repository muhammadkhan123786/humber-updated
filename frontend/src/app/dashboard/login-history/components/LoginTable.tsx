import React from "react";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  Monitor,
  AlertCircle,
} from "lucide-react";

type LogStatus = "success" | "failed" | "locked";

interface LogEntry {
  id: number;
  name: string;
  username: string;
  status: LogStatus;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  reason?: string;
}

const LOG_DATA: LogEntry[] = [
  {
    id: 1,
    name: "System Administrator",
    username: "@admin",
    status: "success",
    timestamp: "11/01/2025, 14:30:00",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },
  {
    id: 2,
    name: "John Smith",
    username: "@jsmith",
    status: "success",
    timestamp: "11/01/2025, 13:15:00",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },
  {
    id: 3,
    name: "Linda Brown",
    username: "@lbrown",
    status: "locked",
    timestamp: "09/01/2025, 15:30:00",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    reason: "Account locked after 5 failed attempts",
  },
  {
    id: 4,
    name: "Linda Brown",
    username: "@lbrown",
    status: "failed",
    timestamp: "09/01/2025, 15:25:00",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    reason: "Invalid password",
  },
];

const LoginTable: React.FC = () => {
  const statusStyles: Record<LogStatus, string> = {
    success:
      "from-emerald-500 to-green-500 outline-green-200 border-green-200 hover:bg-green-50/50",
    failed:
      "from-orange-500 to-red-500 outline-orange-200 border-orange-200 hover:bg-orange-50/50",
    locked:
      "from-red-500 to-rose-600 outline-red-200 border-orange-200 hover:bg-orange-50/50",
  };

  return (
    <div className="px-8 bg-[#fbfaff] font-sans text-gray-900">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-indigo-950 font-semibold border-b border-gray-50 pb-4">
          <Activity size={18} className="text-blue-600" />
          <span>Authentication Logs ({LOG_DATA.length})</span>
        </div>

        <div className="flex flex-col gap-4">
          {LOG_DATA.map((log) => (
            <div
              key={log.id}
              className={`p-5 rounded-2xl bg-white border outline-1 -outline-offset-1 transition-all duration-200 shadow-sm hover:shadow-md ${
                statusStyles[log.status]
              } flex flex-col gap-4`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-linear-to-br ${statusStyles[log.status].split(" hover")[0]} flex items-center justify-center text-white shadow-md`}
                  >
                    {log.status === "success" ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{log.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {log.username}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full bg-linear-to-r ${statusStyles[log.status].split(" hover")[0]} text-white text-[10px] font-bold uppercase tracking-wider`}
                >
                  {log.status}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                  <Clock size={16} className="text-blue-500" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Timestamp
                    </p>
                    <p className="text-xs text-gray-700 font-medium">
                      {log.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                  <Globe size={16} className="text-purple-500" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      IP Address
                    </p>
                    <p className="text-xs text-gray-700 font-mono">
                      {log.ipAddress}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                  <Monitor size={16} className="text-indigo-500" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      User Agent
                    </p>
                    <p className="text-xs text-gray-700 truncate">
                      {log.userAgent}
                    </p>
                  </div>
                </div>
              </div>
              {log.reason && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl border border-red-100 text-red-700">
                  <AlertCircle size={14} />
                  <span className="text-xs font-medium">
                    Reason: {log.reason}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginTable;
