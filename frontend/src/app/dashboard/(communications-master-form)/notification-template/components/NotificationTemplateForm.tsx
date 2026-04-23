// components/NotificationTemplateForm/index.tsx
"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Save, Bell, Sparkles, Eye } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { useFormActions } from "@/hooks/useFormActions";
import { getAll } from "@/helper/apiHelper";
import toast from "react-hot-toast";

import TemplateEditor from "./NotificationTemplateForm/TemplateEditor";
import { ChannelBadge } from "./NotificationTemplateForm/ChannelBadge";
import { VariablesList } from "./NotificationTemplateForm/VariablesList";
import { AIPanel } from "./NotificationTemplateForm/AIPanel/index";
import { EmailPreviewModal } from "./NotificationTemplateForm/PreviewModals/EmailPreviewModal";
import { SMSPreviewModal } from "./NotificationTemplateForm/PreviewModals/SMSPreviewModal";
import { WAPreviewModal } from "./NotificationTemplateForm/PreviewModals/WAPreviewModal"
import { ChannelType, Variable } from "./NotificationTemplateForm/types";

const detectChannel = (name = ""): ChannelType => {
  const n = name.toLowerCase();
  if (n.includes("sms") || n.includes("text")) return "sms";
  if (n.includes("whatsapp")) return "whatsapp";
  return "email";
};

const NotificationTemplateForm = ({ editingData, onClose, themeColor }: any) => {
  const queryClient = useQueryClient();
  const [eventActions, setEventActions] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedVariables, setSelectedVariables] = useState<Variable[]>([]);
  const [isDropdownLoading, setIsDropdownLoading] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { createItem, updateItem, isSaving } = useFormActions("/notification-templates", "notification-templates", "Template");

  const { register, handleSubmit, control, setValue, watch, reset } = useForm({
    defaultValues: { eventKeyId: "", channelId: "", subject: "", templateBody: "", isActive: true, isDefault: false },
  });

  const selectedEventId = watch("eventKeyId");
  const selectedChannelId = watch("channelId");
  const templateBody = watch("templateBody");
  const isDefaultChecked = watch("isDefault");

  const selectedEvent = eventActions.find((e) => e._id === selectedEventId);
  const selectedProvider = providers.find((p) => p._id === selectedChannelId);
  const channelName = selectedProvider?.channelId?.channelName || "Email";
  const currentChannel = detectChannel(channelName);
  const isEmail = currentChannel === "email";
  const isSMS = currentChannel === "sms";
  const isWA = currentChannel === "whatsapp";

  // Fetch data
  useEffect(() => {
    const load = async () => {
      try {
        const [eventsRes, providersRes] = await Promise.all([
          getAll("/event-action?filter=all", { limit: "100", requiredUserId: "false" }),
          getAll("/channel-providers?filter=all", { limit: "100", requiredUserId: "false" }),
        ]);
        setEventActions(eventsRes.data || []);
        setProviders(providersRes.data || []);
      } catch (err) {
        toast.error("Failed to load form data");
      } finally {
        setIsDropdownLoading(false);
      }
    };
    load();
  }, []);

  // Load editing data
  useEffect(() => {
    if (editingData && !isDropdownLoading) {
      reset({
        eventKeyId: editingData.eventKeyId?._id || editingData.eventKeyId,
        channelId: editingData.channelId?._id || editingData.channelId,
        subject: editingData.subject || "",
        templateBody: editingData.templateBody || "",
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
      });
    }
  }, [editingData, reset, isDropdownLoading]);

  // Update variables on event change
  useEffect(() => {
    const event = eventActions.find((e) => e._id === selectedEventId);
    setSelectedVariables(event?.variables?.map((v: any) => ({ key: v.key, label: v.label || v.key })) || []);
  }, [selectedEventId, eventActions]);

  const onSubmit = async (values: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = { ...values, userId: user.id || user._id };

    const handleSuccess = async () => {
      await queryClient.invalidateQueries({ queryKey: ["notification-templates"] });
      toast.success(editingData ? "Template updated!" : "Template created!");
      onClose();
    };

    if (editingData?._id) {
      updateItem({ id: editingData._id, payload }, { onSuccess: handleSuccess });
    } else {
      createItem(payload, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      {/* Preview Modals */}
      {showPreview && isEmail && <EmailPreviewModal html={templateBody} onClose={() => setShowPreview(false)} />}
      {showPreview && isSMS && <SMSPreviewModal text={templateBody} onClose={() => setShowPreview(false)} />}
      {showPreview && isWA && <WAPreviewModal text={templateBody} onClose={() => setShowPreview(false)} />}

      {/* AI Panel */}
      {showAI && selectedEvent && (
        <AIPanel
          channel={currentChannel}
          eventName={selectedEvent.name}
          eventDescription={selectedEvent.description}
          variables={selectedVariables}
          onInsert={(subject, body) => { setValue("subject", subject); setValue("templateBody", body); }}
          onClose={() => setShowAI(false)}
        />
      )}

      <FormModal title={editingData ? "Edit Template" : "Add Template"} icon={<Bell size={24} />} onClose={onClose} themeColor={themeColor}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5 max-h-[80vh] overflow-y-auto">
          
          {/* Event & Channel Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Event Action *</label>
              <select {...register("eventKeyId")} className="w-full p-2.5 rounded-lg border border-slate-200">
                <option value="">Select Event</option>
                {eventActions.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Channel Provider *</label>
              <select {...register("channelId")} className="w-full p-2.5 rounded-lg border border-slate-200">
                <option value="">Select Provider</option>
                {providers.map((p) => <option key={p._id} value={p._id}>{p.providerName} ({p.channelId?.channelName})</option>)}
              </select>
            </div>
          </div>

          {/* Actions Bar */}
          {selectedChannelId && selectedEventId && (
            <div className="flex items-center justify-between">
              <ChannelBadge channel={currentChannel} />
              <div className="flex gap-2">
                {templateBody && (
                  <button type="button" onClick={() => setShowPreview(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold border bg-blue-50">
                    <Eye size={12} /> Preview
                  </button>
                )}
                <button type="button" onClick={() => setShowAI(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600">
                  <Sparkles size={14} /> Generate with AI
                </button>
              </div>
            </div>
          )}

          {/* Variables */}
          <VariablesList variables={selectedVariables} onInsert={(key) => setValue("templateBody", templateBody + `{{${key}}}`)} />

          {/* Subject */}
          <FormInput label="Subject" placeholder="Template Subject" {...register("subject")} />

          {/* ✅ Template Editor - Replaces HtmlTemplateEditor */}
          <TemplateEditor
            value={templateBody}
            onChange={(val) => setValue("templateBody", val)}
            variables={selectedVariables}
            label="Template Body"
            required
            channelType={currentChannel}
            minHeight={isEmail ? "min-h-[260px]" : "min-h-[140px]"}
            placeholder={
              isEmail ? "HTML email will appear here..." : 
              isSMS ? "SMS text (160 chars max)..." : 
              "WhatsApp message (*bold* _italic_ ~strike~)..."
            }
          />

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <Controller control={control} name="isActive" render={({ field }) => <FormToggle label="Active" checked={field.value} onChange={field.onChange} disabled={isDefaultChecked} />} />
            <Controller control={control} name="isDefault" render={({ field }) => <FormToggle label="Default Template" checked={field.value} onChange={field.onChange} />} />
          </div>

          <FormButton type="submit" label={editingData ? "Update Template" : "Save Template"} icon={<Save size={20} />} loading={isSaving} themeColor={themeColor} onCancel={onClose} />
        </form>
      </FormModal>
    </>
  );
};

export default NotificationTemplateForm;