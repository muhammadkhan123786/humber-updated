"use client";
import { useState } from "react";
import { Zap, ChevronDown, Plus, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { createItem, updateItem } from "@/helper/apiHelper";
import toast from "react-hot-toast";

type RecipientType = "Admin" | "Technician" | "Customer" | "Driver";
const RECIPIENT_OPTIONS: RecipientType[] = [
  "Admin",
  "Technician",
  "Customer",
  "Driver",
];

export const AlertRuleForm = ({
  onCancel,
  channels,
  templates,
  events,
  refresh,
  editData,
}: any) => {
  const [selectedChannels, setSelectedChannels] = useState<any[]>(() => {
    if (editData?.channels?.length > 0) {
      return editData.channels.map((c: any) => ({
        channelId: c.channelId?._id || c.channelId,
        templateId: c.templateId?._id || c.templateId,
      }));
    }
    return [{ channelId: "", templateId: "" }];
  });

  const [recipients, setRecipients] = useState<string[]>(() => {
    return editData?.recipients || [];
  });

  const [isActive, setIsActive] = useState(
    editData ? (editData.isActive ?? true) : true,
  );

  const ENDPOINT = "/notification-rules";

  const handleChannelChange = (index: number, field: string, value: string) => {
    const updated = [...selectedChannels];
    updated[index][field] = value;
    setSelectedChannels(updated);
  };

  const addChannelRow = () => {
    setSelectedChannels([
      ...selectedChannels,
      { channelId: "", templateId: "" },
    ]);
  };

  const removeChannelRow = (index: number) => {
    setSelectedChannels(selectedChannels.filter((_, i) => i !== index));
  };

  const handleRecipientToggle = (role: string) => {
    setRecipients((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || user._id;

    if (recipients.length === 0)
      return toast.error("Select at least one recipient");

    if (selectedChannels.some((c) => !c.channelId || !c.templateId)) {
      return toast.error("Please select channel and template for all rows");
    }

    const payload = {
      notificationRulesName: formData.get("notificationRulesName"),
      eventKeyId: formData.get("eventKeyId"),
      conditions: formData.get("conditions"),
      priority: Number(formData.get("priority")),
      channels: selectedChannels,
      recipients: recipients,
      userId: userId,
      isActive,
    };

    try {
      if (editData) {
        await updateItem(ENDPOINT, editData._id, payload);
        toast.success("Rule updated successfully");
      } else {
        await createItem(ENDPOINT, payload);
        toast.success("Rule created successfully");
      }
      refresh();
      onCancel();
    } catch (err: any) {
      toast.error(err.message || "Error saving data");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-linear-to-br from-white to-purple-50 rounded-2xl border border-slate-200 p-6 md:p-7 mb-8 overflow-hidden"
    >
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="bg-linear-to-r from-purple-500 to-pink-500 p-2.5 rounded-xl text-white shadow-lg">
          <Zap size={20} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          {editData ? "Edit Rule" : "Create New Alert Rule"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 space-y-1">
            <label className="text-[13px] font-semibold text-slate-800 ml-1">
              Rule Name
            </label>
            <input
              name="notificationRulesName"
              defaultValue={editData?.notificationRulesName}
              required
              placeholder="Enter rule name"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex-1 space-y-1">
            <label className="text-[13px] font-semibold text-slate-800 ml-1">
              Event Action (Trigger)
            </label>
            <div className="relative">
              <select
                name="eventKeyId"
                defaultValue={editData?.eventKeyId?._id || editData?.eventKeyId}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm appearance-none pr-10"
              >
                <option value="">Select Event</option>
                {events.map((e: any) => (
                  <option key={e._id} value={e._id}>
                    {e.eventKey} ({e.moduleId?.moduleName})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[13px] font-semibold text-slate-800 ml-1">
            Channels & Templates
          </label>
          {selectedChannels.map((row, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-3 items-center bg-white/50 p-3 rounded-xl border border-slate-100"
            >
              <select
                value={row.channelId}
                onChange={(e) =>
                  handleChannelChange(index, "channelId", e.target.value)
                }
                className="w-full md:flex-1 p-2 rounded-lg border border-slate-200 text-sm"
              >
                <option value="">Select Channel</option>
                {channels.map((c: any) => (
                  <option key={c._id} value={c._id}>
                    {c.channelName}
                  </option>
                ))}
              </select>
              <select
                value={row.templateId}
                onChange={(e) =>
                  handleChannelChange(index, "templateId", e.target.value)
                }
                className="w-full md:flex-1 p-2 rounded-lg border border-slate-200 text-sm"
              >
                <option value="">Select Template</option>
                {templates.map((t: any) => (
                  <option key={t._id} value={t._id}>
                    {t.subject}
                  </option>
                ))}
              </select>
              {selectedChannels.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeChannelRow(index)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addChannelRow}
            className="flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700"
          >
            <Plus size={16} /> Add Another Channel
          </button>
        </div>
        <div className="space-y-3">
          <label className="text-[13px] font-semibold text-slate-800 ml-1">
            Select Recipients (Roles)
          </label>
          <div className="flex flex-wrap gap-3 p-4 bg-white/50 rounded-xl border border-slate-100">
            {RECIPIENT_OPTIONS.map((role) => (
              <label
                key={role}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  recipients.includes(role)
                    ? "bg-purple-100 border-purple-400 text-purple-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-purple-300"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={recipients.includes(role)}
                  onChange={() => handleRecipientToggle(role)}
                />
                <span className="text-sm font-medium">{role}</span>
                {recipients.includes(role) && <X size={14} className="ml-1" />}
              </label>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 ml-1">
            Selected: {recipients.length > 0 ? recipients.join(", ") : "None"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-5 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-[13px] font-semibold text-slate-800 ml-1">
              Conditions
            </label>
            <input
              name="conditions"
              defaultValue={editData?.conditions}
              placeholder="e.g. priority > 1"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[13px] font-semibold text-slate-800 ml-1">
              Priority
            </label>
            <input
              name="priority"
              type="number"
              defaultValue={editData?.priority ?? 1}
              required
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex py-2 gap-6 items-center">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="accent-purple-500 size-4 rounded"
            />
            Active
          </label>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-7 py-2 rounded-lg font-bold bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-md text-sm transition-transform active:scale-95"
          >
            {editData ? "Update Rule" : "Create Rule"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
