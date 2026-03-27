"use client";
import React from "react";
import { Smartphone, Plus, Trash2 } from "lucide-react";

interface ChannelTemplate {
  channelId: string;
  templateId: string;
}

interface CommunicationModeProps {
  channels: any[];
  selectedChannels: ChannelTemplate[];
  onChannelSelect: (
    index: number,
    field: "channelId" | "templateId",
    value: string,
  ) => void;
  onAddChannel: () => void;
  onRemoveChannel: (index: number) => void;
  getTemplatesForChannel: (channelId: string) => any[];
}

const CommunicationMode = ({
  channels,
  selectedChannels,
  onChannelSelect,
  onAddChannel,
  onRemoveChannel,
  getTemplatesForChannel,
}: CommunicationModeProps) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
      <div className="bg-[#F0FFF9] p-5 flex items-start gap-4 border-b border-[#E0F2F1]">
        <div className="bg-[#00C48C] p-2 rounded-xl text-white shadow-sm">
          <Smartphone size={18} />
        </div>
        <div className="flex-1">
          <h2 className="text-[15px] font-bold text-[#1E1F4B]">
            Communication Mode
          </h2>
          <p className="text-[12px] text-[#808191]">
            Select one or more notification channels
          </p>
        </div>
        <button
          type="button"
          onClick={onAddChannel}
          className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg"
        >
          <Plus size={16} /> Add Channel
        </button>
      </div>
      <div className="p-6 space-y-4">
        {selectedChannels.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Click Add Channel to configure notification channels
          </div>
        ) : (
          selectedChannels.map((channel, index) => {
            const templatesForChannel = getTemplatesForChannel(
              channel.channelId,
            );
            const selectedChannel = channels.find(
              (c) => c._id === channel.channelId,
            );

            return (
              <div
                key={index}
                className="flex gap-3 items-start p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex-1">
                  <select
                    value={channel.channelId}
                    onChange={(e) =>
                      onChannelSelect(index, "channelId", e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Channel</option>
                    {channels.map((ch: any) => (
                      <option key={ch._id} value={ch._id}>
                        {ch.channelName || ch.name}
                      </option>
                    ))}
                  </select>
                  {selectedChannel && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedChannel.description ||
                        "Select a template for this channel"}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <select
                    value={channel.templateId}
                    onChange={(e) =>
                      onChannelSelect(index, "templateId", e.target.value)
                    }
                    disabled={!channel.channelId}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Template</option>
                    {templatesForChannel.length === 0 ? (
                      <option value="" disabled>
                        No templates available
                      </option>
                    ) : (
                      templatesForChannel.map((template: any) => (
                        <option key={template._id} value={template._id}>
                          {template.name || template.subject}
                        </option>
                      ))
                    )}
                  </select>
                  {channel.channelId && templatesForChannel.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      No templates available
                    </p>
                  )}
                  {channel.channelId && templatesForChannel.length > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      {templatesForChannel.length} template(s) available
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveChannel(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunicationMode;
