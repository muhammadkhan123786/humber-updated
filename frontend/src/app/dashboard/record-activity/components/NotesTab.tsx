"use client";
import React, { useState, useRef } from "react";
import {
  Image as ImageIcon,
  Video,
  MessageSquare,
  Plus,
  FileEdit,
  CheckCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  id: string;
  type: 'MESSAGE' | 'IMAGE' | 'VIDEO';
  content: string;
  timestamp: string;
}

export const NotesTab = () => {
  const [msgInput, setMsgInput] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCurrentTimestamp = () => {
    return new Date().toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(',', '');
  };

  const addMessage = () => {
    if (!msgInput.trim()) return;
    const newItem: MediaItem = {
      id: Date.now().toString(),
      type: 'MESSAGE',
      content: msgInput,
      timestamp: getCurrentTimestamp(),
    };
    setMediaItems([newItem, ...mediaItems]);
    setMsgInput("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem: MediaItem = {
          id: Date.now().toString(),
          type: 'IMAGE',
          content: reader.result as string,
          timestamp: getCurrentTimestamp(),
        };
        setMediaItems([newItem, ...mediaItems]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeItem = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">

      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-4">
          <Plus size={16} className="text-blue-500" />
          <span>Add Media & Messages</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 py-5 rounded-lg bg-[#00AEEF] text-white hover:opacity-90 transition-all">
            <ImageIcon size={20} />
            <span className="text-[11px] font-bold">Add Photos</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 py-5 rounded-lg bg-[#BD32E0] text-white hover:opacity-90 transition-all">
            <Video size={20} />
            <span className="text-[11px] font-bold">Add Videos</span>
          </button>
          <button onClick={addMessage} className="flex flex-col items-center justify-center gap-2 py-5 rounded-lg bg-[#10B981] text-white hover:opacity-90 transition-all">
            <MessageSquare size={20} />
            <span className="text-[11px] font-bold">Add Message</span>
          </button>
        </div>

        <div className="relative">
          <label className="text-[11px] text-gray-500 font-bold ml-1">Quick Message</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMessage()}
              placeholder="Type a message and press Enter..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button onClick={addMessage} className="bg-[#10B981] text-white p-3 rounded-lg hover:bg-emerald-600 transition-colors">
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mediaItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-4">
              <MessageSquare size={16} />
              <span>Media & Messages ({mediaItems.length})</span>
            </div>

            <div className="space-y-3">
              {mediaItems.map((item) => (
                <div key={item.id} className="bg-[#F8FAFF] border border-[#E8EFFF] rounded-xl p-4 relative group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {item.type === 'MESSAGE' ? (
                        <MessageSquare size={14} className="text-emerald-500" />
                      ) : (
                        <ImageIcon size={14} className="text-blue-500" />
                      )}
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.type === 'MESSAGE' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {item.timestamp}
                      </span>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    {item.type === 'MESSAGE' ? (
                      <p className="text-xs text-gray-700 font-medium">{item.content}</p>
                    ) : (
                      <img src={item.content} alt="Uploaded" className="max-h-64 rounded-lg mx-auto object-contain" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm mb-4">
          <FileEdit size={16} />
          <span>General Notes</span>
        </div>
        <textarea rows={3} placeholder="Enter any general notes..." className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:outline-none resize-none" />
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-4">
          <CheckCircle size={16} />
          <span>Completion Summary</span>
        </div>
        <textarea rows={3} placeholder="Summarize the work completed..." className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:outline-none resize-none" />
      </div>
    </motion.div>
  );
};