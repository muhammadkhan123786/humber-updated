"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Loader2,
  Search,
  Mail,
  MessageSquare,
  Globe,
  Send,
  Eye,
  X,
} from "lucide-react";
import { useFormActions } from "@/hooks/useFormActions";
import NotificationTemplateForm from "./NotificationTemplateForm";
import Pagination from "@/components/ui/Pagination";
import { getAll } from "@/helper/apiHelper";

const THEME_COLOR = "var(--primary-gradient)";

const PreviewModal = ({
  item,
  onClose,
}: {
  item: any;
  onClose: () => void;
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-4xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="p-6 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Eye size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 truncate max-w-[300px]">
              Template Preview
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Category
            </label>
            <div>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                {item.eventKeyId?.module || "Service"}
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Subject Line
            </label>
            <div className="bg-blue-50/30 border border-blue-100 p-4 rounded-2xl text-slate-700 font-semibold leading-relaxed">
              {item.subject || "No Subject"}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Message Body
            </label>
            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl text-slate-600 leading-relaxed whitespace-pre-wrap font-sans text-sm">
              {item.templateBody}
            </div>
          </div>
        </div>
        <div className="p-6 bg-slate-50/50 flex justify-end gap-3 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all border border-transparent hover:border-slate-300"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
};

const getChannelStyles = (channelName: string, isActive: boolean) => {
  const name = channelName?.toLowerCase() || "";
  if (name.includes("whatsapp")) {
    return isActive
      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md"
      : "text-slate-600 hover:bg-teal-50";
  }
  if (
    name.includes("sms") ||
    name.includes("text") ||
    name.includes("message")
  ) {
    return isActive
      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
      : "text-slate-600 hover:bg-green-50";
  }
  if (name.includes("mail") || name.includes("email")) {
    return isActive
      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
      : "text-slate-600 hover:bg-blue-50";
  }
  return isActive
    ? "bg-blue-600 text-white shadow-md"
    : "text-slate-600 hover:bg-slate-100";
};

const ChannelIcon = ({
  channelName,
  size = 18,
}: {
  channelName: string;
  size?: number;
}) => {
  const name = channelName?.toLowerCase() || "";
  if (name.includes("sms") || name.includes("text") || name.includes("message"))
    return <MessageSquare size={size} />;
  if (name.includes("whatsapp") || name.includes("wa"))
    return <Send size={size} />;
  if (name.includes("email") || name.includes("mail"))
    return <Mail size={size} />;
  return <Globe size={size} />;
};

export default function NotificationTemplateClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [channels, setChannels] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  const { data, total, isLoading, deleteItem } = useFormActions<any>(
    "/notification-templates",
    "notification-templates",
    "Template",
    currentPage,
    searchTerm,
  );

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res: any = await getAll("/channels?filter=all");
        const channelList = res.data || [];
        setChannels(channelList);
        if (channelList.length > 0) setActiveTab(channelList[0]._id);
      } catch (err) {
        console.error("Error fetching channels:", err);
      }
    };
    fetchChannels();
  }, []);

  const filteredData = data?.filter((item: any) => {
    if (!item.channelId) return false;
    const channelObject = item.channelId;
    const actualChannelId =
      typeof channelObject === "object" && channelObject.channelId
        ? typeof channelObject.channelId === "object"
          ? channelObject.channelId._id
          : channelObject.channelId
        : null;
    return actualChannelId === activeTab;
  });

  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <div className="mx-auto p-4 md:p-6 space-y-6 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
            Template Management
          </h1>
          <p className="text-slate-500 text-sm">
            Design and manage communication templates
          </p>
        </div>
        <button
          onClick={() => {
            setEditingData(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all h-10 px-6 bg-linear-to-r from-blue-500 via-teal-500 to-green-500 hover:shadow-xl hover:scale-[1.02] text-white shadow-lg active:scale-95"
        >
          <Plus size={20} /> Create Template
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-3">
        {channels.map((c) => {
          const isActive = activeTab === c._id;
          const tabStyles = getChannelStyles(c.channelName, isActive);
          return (
            <button
              key={c._id}
              onClick={() => {
                setActiveTab(c._id);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${tabStyles}`}
            >
              <ChannelIcon channelName={c.channelName} />
              {c.channelName} Templates
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search templates By Subject Name ..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 bg-white shadow-sm transition-all"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {showForm && (
        <NotificationTemplateForm
          editingData={editingData}
          onClose={() => setShowForm(false)}
          themeColor={THEME_COLOR}
        />
      )}

      {previewData && (
        <PreviewModal item={previewData} onClose={() => setPreviewData(null)} />
      )}

      {isLoading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-slate-500 font-medium">Loading templates...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredData?.map((item: any) => (
              <div
                key={item._id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-slate-800">
                        {item.eventKeyId?.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-100">
                          {item.eventKeyId?.module || "General"}
                        </span>
                        <span className="text-slate-400 text-[10px] font-medium uppercase">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Subject
                    </label>
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {item.subject || "No Subject"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Message Body
                    </label>
                    <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600 font-mono h-32 overflow-y-auto border border-slate-100 group-hover:bg-white transition-colors">
                      {item.templateBody}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 p-3 border-t border-slate-100 flex justify-between items-center gap-2 group-hover:bg-slate-100/50">
                  <button
                    onClick={() => setPreviewData(item)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  >
                    <Eye size={16} className="opacity-70" />
                    Preview
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingData(item);
                        setShowForm(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredData?.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">
                No templates found for this channel.
              </p>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
