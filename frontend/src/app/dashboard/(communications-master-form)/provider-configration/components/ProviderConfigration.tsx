"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAll,
  getById,
  createItem,
  updateItem,
  deleteItem,
} from "@/helper/apiHelper"; // Ensure deleteItem is exported from your helper
import { toast } from "react-hot-toast";
import {
  Mail,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  Settings,
  Repeat,
  Send,
  Globe,
  Trash2,
} from "lucide-react";

interface FormValues {
  configurationData: Record<string, any>;
}

const ChannelIcon = ({
  channelName,
  size = 20,
}: {
  channelName: string;
  size?: number;
}) => {
  const name = channelName?.toLowerCase() || "";
  if (name.includes("sms") || name.includes("text") || name.includes("message"))
    return <MessageSquare size={size} />;
  if (name.includes("whatsapp") || name.includes("wa"))
    return <Send size={size} />;
  if (
    name.includes("email") ||
    name.includes("gmail") ||
    name.includes("outlook") ||
    name.includes("mail")
  )
    return <Mail size={size} />;
  return <Globe size={size} />;
};

const ProviderSection = ({ provider }: { provider: any }) => {
  const queryClient = useQueryClient();
  const [configId, setConfigId] = useState<string | null>(null);
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { configurationData: {} },
  });

  const { data: fields = [], isFetching: loading } = useQuery({
    queryKey: ["providerFields", provider._id],
    queryFn: async () => {
      const fieldRes = await getById<any[]>(
        "/channel-providers/get-provider-fields",
        provider._id,
      );
      const configRes = await getAll<any>(
        `/client-channel-config-data?providerId=${provider._id}`,
      );
      const config = configRes.data?.[0];
      if (config) {
        setConfigId(config._id);
        reset({ configurationData: config.configurationData });
      }
      return fieldRes.data || [];
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: any) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user._id;
      return configId
        ? updateItem("/client-channel-config-data", configId, {
            configurationData: formData,
            providerId: provider._id,
            userId,
          })
        : createItem("/client-channel-config-data", {
            configurationData: formData,
            providerId: provider._id,
            userId,
          });
    },
    onSuccess: () => {
      toast.success(
        `${provider.channelId?.channelName} setting saved successfully!`,
      );
      queryClient.invalidateQueries({
        queryKey: ["providerFields", provider._id],
      });
    },
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <ChannelIcon
              channelName={provider.channelId?.channelName}
              size={20}
            />
          </div>
          <h2 className="text-md font-semibold text-gray-800">
            {provider.channelId?.channelName} Configuration
          </h2>
        </div>
        {configId && (
          <span className="text-green-600 text-sm font-medium flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle size={16} /> Connected
          </span>
        )}
      </div>
      <div className="p-8">
        {loading ? (
          <div className="flex justify-center p-4">
            <RefreshCw className="animate-spin text-blue-500" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit((d) => mutation.mutate(d.configurationData))}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field: any) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <Controller
                    name={`configurationData.${field.name}` as any}
                    control={control}
                    rules={{
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <input
                          type={field.type === "number" ? "number" : "text"}
                          placeholder={
                            field.placeholder || `Enter ${field.label}...`
                          }
                          className={`w-full h-9 px-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm ${error ? "border-red-500" : "border-gray-200"}`}
                          value={value ?? ""}
                          onChange={(e) =>
                            onChange(
                              field.type === "number"
                                ? e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                                : e.target.value,
                            )
                          }
                        />
                        {error && (
                          <p className="text-red-500 text-xs mt-1 font-medium">
                            {error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 gap-3">
              <button
                type="button"
                className="px-5 py-1 rounded-xl font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                Test Connection
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-1 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700"
              >
                <Settings size={18} />{" "}
                {configId ? "Update Settings" : "Save Settings"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const ProviderConfigurationPage = () => {
  const queryClient = useQueryClient();
  const { data: providers = [] } = useQuery({
    queryKey: ["providers"],
    queryFn: async () =>
      (await getAll<any>("/channel-providers?filter=all")).data || [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteItem("/channel-providers", id),
    onSuccess: () => {
      toast.success("Provider deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });

  return (
    <div className="min-h-screen p-5">
      <div className="mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              Communication Channels
            </h1>
            <p className="text-gray-500 text-sm">
              Configure and manage notification channels
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm">
            <Repeat size={16} /> Test All Connections
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {providers.map((p: any) => (
            <div
              key={p._id}
              className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <ChannelIcon
                    channelName={p.channelId?.channelName}
                    size={24}
                  />
                </div>
                <div className="text-green-600 text-[10px] font-bold uppercase flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                  <CheckCircle size={10} /> Connected
                </div>
              </div>

              <p className="text-gray-400 text-xs font-medium">
                {p.channelId?.channelName} Service
              </p>

              {/* New flex container to align text and icon horizontally */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Active</h3>

                <button
                  onClick={() => deleteMutation.mutate(p._id)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {providers.map((p: any) => (
          <ProviderSection key={p._id} provider={p} />
        ))}
      </div>
    </div>
  );
};

export default ProviderConfigurationPage;
