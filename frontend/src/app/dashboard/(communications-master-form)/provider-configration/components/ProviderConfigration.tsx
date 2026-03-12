"use client";
import React, { useState, useEffect } from "react";
import { getAll, getById } from "@/helper/apiHelper";
import { toast } from "react-hot-toast";
import { Mail, Settings, CheckCircle, RefreshCw } from "lucide-react";

interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  options?: string[];
}

const ProviderConfigration = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [dynamicFields, setDynamicFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  console.log(setIsConnected);
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await getAll<any>("/channel-providers?filter=all");
        setProviders(res.data || []);
      } catch (err) {
        console.log(err);
        toast.error("fail to load providers");
      }
    };
    fetchProviders();
  }, []);

  const handleProviderChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const id = e.target.value;
    setSelectedProvider(id);
    setDynamicFields([]);

    if (id) {
      setLoading(true);
      try {
        const response = await getById<Field[]>(
          "channel-providers/get-provider-fields",
          id,
        );
        if (response.success) {
          setDynamicFields(response.data);
        }
      } catch (err: any) {
        toast.error(err.message || "fail to load provider fields");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Mail size={24} />
            </div>
            <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
              Communication Channels
            </h1>
          </div>

          {selectedProvider && isConnected && (
            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium border border-green-100">
              <CheckCircle size={16} />
              Connected
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="mb-8 bg-blue-50/30 p-4 rounded-xl border border-blue-100/50">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Select Provider
            </label>
            <select
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-700 shadow-sm"
              value={selectedProvider}
              onChange={handleProviderChange}
            >
              <option value="">-- Choose Email Provider --</option>
              {providers.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.providerName} ({p.channelId?.channelName})
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <RefreshCw className="animate-spin mb-2" size={32} />
              <p>Fetching dynamic fields...</p>
            </div>
          ) : (
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {dynamicFields.map((field, index) => (
                  <div
                    key={index}
                    className={field.type === "select" ? "md:col-span-2" : ""}
                  >
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    {field.type === "select" ? (
                      <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all">
                        <option value="">Select {field.label}</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                      />
                    )}
                  </div>
                ))}
              </div>
              {dynamicFields.length > 0 && (
                <div className="flex flex-wrap items-center justify-end gap-4 pt-6 border-t border-gray-50">
                  <button
                    type="button"
                    className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 shadow-sm"
                  >
                    Test Connection
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-200 active:scale-95"
                  >
                    <Settings size={18} />
                    Save Settings
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderConfigration;
