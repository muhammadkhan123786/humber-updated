"use client";
import {
  Mail,
  MessageSquare,
  Send,
  Edit2,
  Trash2,
  Settings,
} from "lucide-react";

const ChannelBadge = ({ channel }: { channel: string }) => {
  const icons: any = {
    Email: <Mail size={12} />,
    SMS: <MessageSquare size={12} />,
    WhatsApp: <Send size={12} />,
  };
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600">
      {icons[channel]} {channel}
    </div>
  );
};

export const AlertRuleTable = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl shadow-slate-100/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 text-white">
          <Settings size={20} />
        </div>
        <h2 className="text-md font-semibold text-slate-800">
          Configured Alert Rules
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left ]">
          <thead className="border-b border-slate-100">
            <tr className="text-slate-500 text-[12px] uppercase tracking-wider font-bold">
              <th className="px-4 py-4">ID</th>
              <th className="px-4 py-4">Rule Name</th>
              <th className="px-4 py-4">Module</th>
              <th className="px-4 py-4">Trigger</th>
              <th className="px-4 py-4">Threshold</th>
              <th className="px-4 py-4">Assigned Role</th>
              <th className="px-4 py-4">Channels</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((rule) => (
              <tr
                key={rule.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-4 py-5 font-medium text-gray-900">
                  {rule.id}
                </td>
                <td className="px-4 py-5 font-medium text-gray-900 text-sm">
                  {rule.name}
                </td>
                <td className="px-4 py-5">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${rule.module.color}`}
                  >
                    {rule.module.name}
                  </span>
                </td>
                <td className="px-4 py-5 text-sm text-slate-600">
                  {rule.trigger}
                </td>
                <td className="px-4 py-5  text-gray-700 ">{rule.threshold}</td>
                <td className="px-4 py-5 text-sm text-slate-600">
                  {rule.role}
                </td>
                <td className="px-4 py-5">
                  <div className="flex gap-1.5">
                    {rule.channels.map((c: string) => (
                      <ChannelBadge key={c} channel={c} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                    <div className="size-1.5 rounded-full bg-emerald-500" />{" "}
                    {rule.status}
                  </span>
                </td>
                <td className="px-4 py-5 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-blue-600 transition-all">
                      <Edit2 size={14} />
                    </button>
                    <button className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 transition-all">
                      <Trash2 size={14} />
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
