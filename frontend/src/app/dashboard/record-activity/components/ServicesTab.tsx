"use client";
import React, { useState } from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  id: number;
  type: string;
  date: string;
  description: string;
  notes: string;
  duration: number;
}

export const ServicesTab = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [type, setType] = useState("Diagnostic");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddActivity = () => {
    if (!duration || !description) return;

    const newActivity: Activity = {
      id: Date.now(),
      type: type.toUpperCase(),
      date: new Date().toLocaleString("en-GB"),
      description,
      notes,
      duration: parseInt(duration),
    };

    setActivities([newActivity, ...activities]);
    setDuration("");
    setDescription("");
    setNotes("");
  };

  const deleteActivity = (id: number) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const totalMinutes = activities.reduce((acc, curr) => acc + curr.duration, 0);

  const formatTotalTime = (total: number) => {
    if (total < 60) return `${total}m`;
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-[#4F39F6] font-bold">
          <Plus size={20} />
          <span className="text-sm">Add Service Activity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Activity Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#4F39F6] outline-none text-sm"
            >
              <option>Diagnostic</option>
              <option>Repair</option>
              <option>Maintenance</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration (minutes) *</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#4F39F6] outline-none text-sm"
            />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what was done..."
            rows={3}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#4F39F6] outline-none text-sm resize-none"
          />
        </div>

        <div className="space-y-2 mb-8">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Additional Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#4F39F6] outline-none text-sm"
          />
        </div>

        <button
          onClick={handleAddActivity}
          className="w-full py-4 bg-linear-to-r from-[#0061FF] to-[#00C1FF] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Add Service Activity</span>
        </button>
      </div>
      <AnimatePresence>
        {activities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#F6FFF9] border border-emerald-100 rounded-3xl p-6 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-6 text-[#10B981] font-bold">
              <CheckCircle2 size={20} />
              <span className="text-sm">Recorded Service Activities ({activities.length})</span>
            </div>

            <div className="space-y-4 mb-6">
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  layout
                  className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm relative group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-white text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                        activity.type === 'REPAIR' ? 'bg-[#0070F3]' : 'bg-[#10B981]'
                      }`}>
                        {activity.type}
                      </span>
                      <span className="text-[11px] text-gray-400 font-bold">{activity.date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Duration</p>
                        <p className="text-[#0061FF] font-black text-lg">{activity.duration}m</p>
                      </div>
                      <button
                        onClick={() => deleteActivity(activity.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-800">{activity.description}</p>
                    {activity.notes && (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium">{activity.notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-[#0061FF] rounded-2xl p-5 flex items-center justify-between text-white shadow-inner">
              <span className="font-bold tracking-wide">Total Time Spent:</span>
              <span className="text-2xl font-black">{formatTotalTime(totalMinutes)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};