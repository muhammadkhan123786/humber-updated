"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BellDot,
  ChevronDown,
  Sparkles,
  Stars,
  CheckCircle2,
  Lightbulb,
  Copy,
  Check,
  Zap,
  Info,
  RefreshCcw,
} from "lucide-react";
import { getAll, createItem, updateItem, getById } from "@/helper/apiHelper";
import toast from "react-hot-toast";
import CommunicationMode from "./CommunicationMode";
import MessageTemplate from "./MessageTemplate";
import RecipientSettings from "./RecipientSettings";
import AlertStatusFooter from "./AlertStatusFooter";

interface ChannelTemplate {
  channelId: string;
  templateId: string;
  channelName?: string;
  templateName?: string;
}

const MessageAlertSetup = () => {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<any[]>([]);
  const [moduleActions, setModuleActions] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [variables, setVariables] = useState<any[]>([]);
  const [selectedEventData, setSelectedEventData] = useState<any>(null);
  const [channelProviders, setChannelProviders] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  console.log(selectedEventData);
  const [formName, setFormName] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [channelTemplates, setChannelTemplates] = useState<ChannelTemplate[]>(
    [],
  );
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [conditions, setConditions] = useState("");
  const [priority, setPriority] = useState(1);
  const [editData, setEditData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (
      editId &&
      modules.length > 0 &&
      channels.length > 0 &&
      templates.length > 0
    ) {
      fetchEditData(editId);
    }
  }, [editId, modules, channels, templates]);

  const fetchEditData = async (id: string) => {
    try {
      const response = await getById("/notification-rules", id);
      const ruleData: any = response.data;
      setEditData(ruleData);
      setIsEditMode(true);
      setFormName(ruleData.notificationRulesName || "");
      setSelectedModule(ruleData.moduleId?._id || ruleData.moduleId || "");
      setDescription(ruleData.description || "");
      setSelectedEvent(ruleData.eventKeyId?._id || ruleData.eventKeyId || "");
      setConditions(ruleData.conditions || "");
      setPriority(ruleData.priority || 1);
      setIsActive(ruleData.isActive ?? true);
      setSelectedRecipients(ruleData.recipients || []);

      if (ruleData.actionId?.actionKey) {
        setSelectedAction(ruleData.actionId.actionKey);
      }

      if (ruleData.channels && ruleData.channels.length > 0) {
        const channelsData = ruleData.channels.map((ch: any) => ({
          channelId: ch.channelId?._id || ch.channelId,
          templateId: ch.templateId?._id || ch.templateId,
        }));
        setChannelTemplates(channelsData);
      }
    } catch (error: any) {
      console.error("Error fetching edit data:", error);
      toast.error("Failed to load rule data for editing");
    }
  };

  const fetchData = async () => {
    try {
      const [modulesRes, channelsRes, templatesRes, providersRes] =
        await Promise.all([
          getAll("/modules?filter=all", { requiredUserId: "false" }),
          getAll("/channels?filter=all"),
          getAll("/notification-templates?filter=all"),
          getAll("/channel-providers?filter=all"),
        ]);

      setModules(modulesRes.data || []);
      setChannels(channelsRes.data || []);
      setTemplates(templatesRes.data || []);
      setChannelProviders(providersRes.data || []);
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to load data");
    }
  };

  const fetchModuleActions = useCallback(async () => {
    try {
      const response = await getAll("/module-actions?filter=all", {
        moduleId: selectedModule,
        requiredUserId: "false",
      });
      setModuleActions(response.data || []);
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to load module actions");
    }
  }, [selectedModule]);

  useEffect(() => {
    if (selectedModule) {
      fetchModuleActions();
    } else {
      setModuleActions([]);
      setSelectedAction("");
    }
  }, [selectedModule, fetchModuleActions]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await getAll("/event-action?filter=all", {
        requiredUserId: "false",
      });

      const selectedActionData = moduleActions.find(
        (action) => action.actionKey === selectedAction,
      );

      if (selectedActionData) {
        const filteredEvents = response.data.filter(
          (event: any) => event.name === selectedActionData.name,
        );
        setEvents(filteredEvents);
      } else {
        setEvents([]);
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to load events");
    }
  }, [moduleActions, selectedAction]);

  useEffect(() => {
    if (selectedAction) {
      fetchEvents();
    } else {
      setEvents([]);
      setSelectedEvent("");
      setVariables([]);
      setSelectedEventData(null);
    }
  }, [selectedAction, fetchEvents]);

  useEffect(() => {
    if (selectedEvent) {
      const eventData = events.find((e) => e._id === selectedEvent);
      setSelectedEventData(eventData);
      if (eventData?.variables && Array.isArray(eventData.variables)) {
        const variableKeys = eventData.variables.map((v: any) => v.key || v);
        setVariables(variableKeys);
      } else if (
        eventData?.variables &&
        typeof eventData.variables === "object"
      ) {
        setVariables(Object.keys(eventData.variables));
      } else {
        setVariables([]);
      }
    } else {
      setVariables([]);
      setSelectedEventData(null);
    }
  }, [selectedEvent, events]);

  const addChannelTemplate = () => {
    setChannelTemplates([
      ...channelTemplates,
      { channelId: "", templateId: "" },
    ]);
  };

  const removeChannelTemplate = (index: number) => {
    const updated = channelTemplates.filter((_, i) => i !== index);
    setChannelTemplates(updated);
  };

  const updateChannelTemplate = (
    index: number,
    field: keyof ChannelTemplate,
    value: string,
  ) => {
    const updated = [...channelTemplates];
    updated[index] = { ...updated[index], [field]: value };
    setChannelTemplates(updated);
  };

  const getTemplatesForChannel = useCallback(
    (selectedChannelId: string) => {
      if (!selectedChannelId) return [];
      const channelProvider = channelProviders.find(
        (provider) => provider.channelId === selectedChannelId,
      );

      let filteredTemplates = [];

      if (channelProvider) {
        filteredTemplates = templates.filter(
          (template) => template.channelId === channelProvider._id,
        );
      } else {
        filteredTemplates = templates;
      }

      return filteredTemplates;
    },
    [channelProviders, templates],
  );

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName) {
      toast.error("Please enter form name");
      return;
    }
    if (!selectedModule) {
      toast.error("Please select a module");
      return;
    }
    if (!selectedAction) {
      toast.error("Please select a module action");
      return;
    }
    if (!selectedEvent) {
      toast.error("Please select an event");
      return;
    }
    if (channelTemplates.length === 0) {
      toast.error("Please add at least one channel");
      return;
    }
    const invalidChannel = channelTemplates.find(
      (ch) => !ch.channelId || !ch.templateId,
    );
    if (invalidChannel) {
      toast.error("Please select both channel and template for each entry");
      return;
    }
    if (selectedRecipients.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || user._id;
    const selectedActionObj = moduleActions.find(
      (action) => action.actionKey === selectedAction,
    );

    const payload = {
      notificationRulesName: formName,
      moduleId: selectedModule,
      actionId: selectedActionObj?._id,
      eventKeyId: selectedEvent,
      description: description,
      channels: channelTemplates.map((ch) => ({
        channelId: ch.channelId,
        templateId: ch.templateId,
      })),
      recipients: selectedRecipients,
      conditions: conditions,
      priority: priority,

      isActive: isActive,
      userId: userId,
    };

    try {
      if (isEditMode && editData) {
        await updateItem("/notification-rules", editData._id, payload);
        toast.success("Alert rule updated successfully");
      } else {
        await createItem("/notification-rules", payload);
        toast.success("Alert rule created successfully");
      }
      router.push("/dashboard/alert-setup-list");
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to save alert rule");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormName("");
    setSelectedModule("");
    setSelectedAction("");
    setDescription("");
    setSelectedEvent("");
    setChannelTemplates([]);
    setSelectedRecipients([]);
    setConditions("");
    setPriority(1);
    setIsActive(true);
    setEditData(null);
    setVariables([]);
    setSelectedEventData(null);
    setIsEditMode(false);
  };

  const getModuleName = (moduleId: string) => {
    const foundModule = modules.find((m) => m._id === moduleId);
    return (
      foundModule?.moduleKey ||
      foundModule?.moduleName ||
      foundModule?.name ||
      moduleId
    );
  };

  const getActionName = (actionKey: string) => {
    const action = moduleActions.find((a) => a.actionKey === actionKey);
    return action?.name || actionKey;
  };

  return (
    <div className="bg-[#F0F5FD] p-6 font-sans text-[#1E1F4B]">
      <div className="flex items-center gap-4 mb-8 ml-2">
        <div className="flex items-center justify-center h-12 w-12 bg-linear-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
          <BellDot size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {isEditMode ? "Edit Message Alert" : "Message Alert Setup"}
          </h1>
          <p className="text-[13px] text-[#555675] font-medium opacity-80">
            {isEditMode
              ? "Update your alert configuration"
              : "Configure automated notifications for customer events"}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-[2.5] w-full space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-white/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-2.5 rounded-xl text-white">
                  <Stars size={18} />
                </div>
                <div>
                  <h2 className="text-[15px] font-extrabold tracking-wide">
                    Basic Information
                  </h2>
                  <p className="text-[11px] text-[#808191] font-medium">
                    Define the alert configuration details
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium ml-1 uppercase tracking-wider opacity-90">
                    Form Name <span className="text-purple-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Ticket Status Update Alert"
                    className="w-full h-10 px-5 rounded-xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] transition-all placeholder:text-[#ACB5BD]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium ml-1 uppercase tracking-wider opacity-90">
                    Form Module <span className="text-purple-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                      className="w-full h-10 px-5 rounded-xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a form module</option>
                      {modules.map((module) => (
                        <option key={module._id} value={module._id}>
                          {module.moduleKey || module.moduleName || module.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-3.5 text-[#ACB5BD] pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium ml-1 uppercase tracking-wider opacity-90">
                    Module Action <span className="text-purple-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedAction}
                      onChange={(e) => setSelectedAction(e.target.value)}
                      disabled={!selectedModule}
                      className="w-full h-10 px-5 rounded-xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] transition-all appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">Select module action</option>
                      {moduleActions.map((action) => (
                        <option key={action._id} value={action.actionKey}>
                          {action.name} ({action.actionKey})
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-3.5 text-[#ACB5BD] pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium ml-1 uppercase tracking-wider opacity-90">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of when this alert should be triggered..."
                    className="w-full h-[100px] p-5 rounded-2xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] transition-all placeholder:text-[#ACB5BD] resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium ml-1 uppercase tracking-wider opacity-90">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    min="1"
                    max="10"
                    className="w-full h-10 px-5 rounded-xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium ml-1 uppercase tracking-wider opacity-90">
                    Conditions
                  </label>
                  <textarea
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder='e.g., { "priority": { "$gt": 5 }, "status": "urgent" }'
                    className="w-full h-20 p-5 rounded-2xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] transition-all placeholder:text-[#ACB5BD] resize-none font-mono"
                  />
                  <p className="text-[10px] text-gray-400 ml-1">
                    Optional: Enter conditions in JSON format to filter when
                    this alert should trigger
                  </p>
                </div>
                {selectedModule && selectedAction && (
                  <div className="mt-6 p-5 bg-[#EFFFF6] border border-[#00C48C44] rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-[#00C48C] p-2 rounded-xl text-white">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked
                          readOnly
                          className="accent-[#00C48C] h-4 w-4"
                        />
                        <h3 className="text-[14px] font-bold text-[#1E1F4B]">
                          Alert Trigger Configuration
                        </h3>
                      </div>
                      <div className="text-[12px] font-medium space-y-0.5 ml-6">
                        <p className="text-[#555675]">
                          Module:{" "}
                          <span className="text-[#00A374]">
                            {getModuleName(selectedModule)}
                          </span>
                        </p>
                        <p className="text-[#555675]">
                          Action:{" "}
                          <span className="text-[#00A374]">
                            {getActionName(selectedAction)}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#00C48C11] ml-6">
                        <Lightbulb size={14} className="text-orange-400" />
                        <p className="text-[11px] italic text-[#555675]">
                          This alert will be triggered when the selected module
                          action occurs.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl my-3 p-8 shadow-sm border border-white/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-linear-to-br from-purple-500 to-fuchsia-500 p-2.5 rounded-xl text-white">
                  <Zap size={18} />
                </div>
                <div>
                  <h2 className="text-[15px] font-extrabold tracking-wide">
                    Event Configuration
                  </h2>
                  <p className="text-[11px] text-[#808191] font-medium">
                    Select the trigger event for this alert
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium ml-1 uppercase tracking-wider opacity-90">
                    Event Name <span className="text-purple-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-3 text-blue-500">
                      <RefreshCcw size={16} />
                    </div>
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      disabled={!selectedAction}
                      className="w-full h-10 pl-11 pr-5 rounded-xl bg-[#F5F8FF] border-2 border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] font-semibold transition-all appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">Select an event</option>
                      {events.map((event) => (
                        <option key={event._id} value={event._id}>
                          {event.name} ({event.eventKey})
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-4 text-[#ACB5BD] pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>

                {selectedEvent && (
                  <div className="p-4 bg-[#F5F1FF] border border-purple-100 rounded-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                    <div className="bg-white p-2 rounded-full text-purple-600 shadow-sm border border-purple-50">
                      <Info size={18} />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-[13px] font-bold text-[#1E1F4B]">
                        Event Selected
                      </h3>
                      <p className="text-[11px] text-[#555675]">
                        This alert will trigger when:{" "}
                        <span className="font-bold">
                          {events.find((e) => e._id === selectedEvent)?.name}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="my-3">
              <CommunicationMode
                channels={channels}
                selectedChannels={channelTemplates}
                onChannelSelect={updateChannelTemplate}
                onAddChannel={addChannelTemplate}
                onRemoveChannel={removeChannelTemplate}
                getTemplatesForChannel={getTemplatesForChannel}
              />
            </div>

            {channelTemplates.map((channelTemplate, index) => {
              const selectedChannel = channels.find(
                (c) => c._id === channelTemplate.channelId,
              );
              const selectedTemplate = templates.find(
                (t) => t._id === channelTemplate.templateId,
              );

              return (
                <MessageTemplate
                  key={index}
                  index={index}
                  channelName={
                    selectedChannel?.channelName ||
                    selectedChannel?.name ||
                    "Channel"
                  }
                  template={selectedTemplate}
                  variables={variables}
                  onTemplateSelect={(templateId) =>
                    updateChannelTemplate(index, "templateId", templateId)
                  }
                />
              );
            })}

            <RecipientSettings
              selectedRecipients={selectedRecipients}
              onRecipientSelect={setSelectedRecipients}
            />

            <AlertStatusFooter
              isActive={isActive}
              onStatusChange={setIsActive}
              onSubmit={handleSubmit}
              onCancel={resetForm}
              loading={loading}
              isEditMode={isEditMode}
            />
          </form>
        </div>

        <div className="flex-1 w-full space-y-6 lg:top-6">
          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm h-[480px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-2.5 rounded-xl text-white">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="font-bold text-[15px]">Dynamic Variables</h2>
                <p className="text-[11px] text-[#808191] font-medium">
                  Click to copy
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {!selectedAction ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Select a module action first
                </div>
              ) : !selectedEvent ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Select an event to see available variables
                </div>
              ) : variables.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No variables available for this event
                </div>
              ) : (
                variables.map((variable, index) => (
                  <div
                    key={index}
                    onClick={() => handleCopy(variable)}
                    className="relative w-full bg-white border border-slate-100 p-4 rounded-2xl hover:border-purple-300 transition-all cursor-pointer group active:scale-[0.98] shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-mono text-[13px] font-bold text-purple-600 mb-1">
                        {typeof variable === "string"
                          ? variable
                          : variable.key ||
                            variable.name ||
                            JSON.stringify(variable)}
                      </p>
                      <p className="text-[11px] text-[#555675] font-semibold opacity-80">
                        {typeof variable === "string"
                          ? "Dynamic variable"
                          : variable.description || "Dynamic variable"}
                      </p>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#F5F1FF] px-2 py-1 rounded-lg flex items-center gap-1 border border-purple-100 shadow-sm">
                      {copiedKey ===
                      (typeof variable === "string"
                        ? variable
                        : variable.key) ? (
                        <>
                          <Check size={12} className="text-green-600" />
                          <span className="text-[10px] font-bold text-green-600">
                            Copied
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} className="text-purple-600" />
                          <span className="text-[10px] font-bold text-purple-600">
                            Copy
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl shadow-purple-200">
            <h2 className="font-bold text-[15px] mb-4">
              Configuration Summary
            </h2>
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl flex justify-between items-center border border-white/10">
                <span className="text-[12px] font-medium opacity-90">
                  Channels Selected
                </span>
                <span className="bg-white text-purple-600 h-6 w-6 flex items-center justify-center rounded-full text-[11px] font-bold">
                  {channelTemplates.length}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl flex justify-between items-center border border-white/10">
                <span className="text-[12px] font-medium opacity-90">
                  Recipients
                </span>
                <span className="bg-white text-purple-600 h-6 w-6 flex items-center justify-center rounded-full text-[11px] font-bold">
                  {selectedRecipients.length}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl flex justify-between items-center border border-white/10">
                <span className="text-[12px] font-medium opacity-90">
                  Status
                </span>
                <span
                  className={`${isActive ? "bg-emerald-400" : "bg-gray-400"} text-white px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-tight`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default MessageAlertSetup;
