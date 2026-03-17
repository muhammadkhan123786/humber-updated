"use client";
import { useState, useEffect } from "react";
import { Zap, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { createItem, updateItem } from "@/helper/apiHelper";
import toast from "react-hot-toast";

export const AlertRuleForm = ({
  onCancel,
  modules,
  channels,
  templates,
  events,
  refresh,
  editData,
}: any) => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<{ channelIds?: string }>({});
  const ENDPOINT = "/notification-rules";

  useEffect(() => {
    if (editData) {
      const channelIds = editData.channelIds?.map((c: any) => c._id) || [];
      setTimeout(() => {
        setSelectedChannels(channelIds);
        setIsActive(editData.isActive ?? true);
        setIsDefault(editData.isDefault ?? false);
      }, 0);
    }
  }, [editData]);
  console.log(errors);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (selectedChannels.length === 0) {
      setErrors({ channelIds: "Select at least one channel" });
      toast.error("Select at least one channel");
      return;
    }

    setErrors({});
    const formData = new FormData(e.target);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = {
      notificationRulesName: formData.get("notificationRulesName"),
      moduleId: formData.get("moduleId"),
      eventKeyId: formData.get("eventKeyId"),
      templateId: formData.get("templateId"),
      conditions: formData.get("conditions"),
      priority: Number(formData.get("priority")),
      channelIds: selectedChannels,
      isActive,
      isDefault,
      userId: user.id,
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
      if (Array.isArray(err.response?.data?.errors)) {
        const channelErr = err.response.data.errors.find((e: any) =>
          e.path.includes("channelIds"),
        );
        if (channelErr) setErrors({ channelIds: channelErr.message });
      }
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
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          <div className="flex-1 space-y-1">
            <label className="text-[13px] font-semibold text-slate-800 ml-1">
              Module
            </label>
            <div className="relative">
              <select
                name="moduleId"
                defaultValue={editData?.moduleId?._id}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm appearance-none pr-10"
              >
                <option value="">Select Module</option>
                {modules.map((m: any) => (
                  <option key={m._id} value={m._id}>
                    {m.moduleName}
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

        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 space-y-1">
            <label className="text-[13px] font-semibold text-slate-800 ml-1">
              Event Action (Trigger)
            </label>
            <div className="relative">
              <select
                name="eventKeyId"
                defaultValue={editData?.eventKeyId?._id}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm appearance-none pr-10"
              >
                <option value="">Select Event</option>
                {events.map((e: any) => (
                  <option key={e._id} value={e._id}>
                    {e.eventKey}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <label className="text-[13px] font-semibold text-slate-800 ml-1">
              Template (Subject)
            </label>
            <div className="relative">
              <select
                name="templateId"
                defaultValue={
                  editData?.templateId?._id || editData?.templateId || ""
                }
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm appearance-none pr-10"
              >
                <option value="">Select Template</option>
                {templates.map((t: any) => (
                  <option key={t._id} value={t._id}>
                    {t.subject}
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
              priority
            </label>
            <input
              name="priority"
              type="number"
              defaultValue={editData?.priority ?? 1}
              required
              placeholder="Enter rule name"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          <div className="flex-1 space-y-2 pb-1">
            <label className="text-[13px] font-semibold text-slate-800 ml-1">
              Channels
            </label>
            <div className="flex items-center gap-4 pt-1">
              {channels.map((c: any) => (
                <label
                  key={c._id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedChannels.includes(c._id)}
                    onChange={(e) => {
                      setErrors({});
                      if (e.target.checked)
                        setSelectedChannels([...selectedChannels, c._id]);
                      else
                        setSelectedChannels(
                          selectedChannels.filter((id) => id !== c._id),
                        );
                    }}
                    className="accent-purple-500 size-4 rounded"
                  />
                  <span className="text-sm text-slate-600">
                    {c.channelName}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex py-4 gap-6 px-4 items-center">
          <label className="flex items-center gap-2 text-md text-slate-700">
            <input
              type="checkbox"
              checked={isActive}
              disabled={isDefault}
              onChange={(e) => setIsActive(e.target.checked)}
              className="accent-blue-500"
            />
            Active
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="accent-blue-500"
            />
            Default
          </label>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-200 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-7 py-2 rounded-lg font-bold bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-md text-sm"
          >
            {editData ? "Update Rule" : "Create Rule"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
