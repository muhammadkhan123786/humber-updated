"use client";
import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Save, Bell, Hash } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { useFormActions } from "@/hooks/useFormActions";
import { getAll } from "@/helper/apiHelper";
import toast from "react-hot-toast";

const NotificationTemplateForm = ({
  editingData,
  onClose,
  themeColor,
}: any) => {
  const queryClient = useQueryClient();
  const [eventActions, setEventActions] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedVariables, setSelectedVariables] = useState<any[]>([]);
  const [isDropdownLoading, setIsDropdownLoading] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { createItem, updateItem, isSaving } = useFormActions(
    "/notification-templates",
    "notification-templates",
    "Template",
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: {},
  } = useForm({
    defaultValues: {
      eventKeyId: "",
      channelId: "",
      subject: "",
      templateBody: "",
      isActive: true,
      isDefault: false,
    },
  });

  const selectedEventId = watch("eventKeyId");
  const isDefaultChecked = watch("isDefault");
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [eventsRes, providersRes] = await Promise.all([
          getAll("/event-action?filter=all", { limit: "100" }),
          getAll("/channel-providers?filter=all", { limit: "100" }),
        ]);
        setEventActions(eventsRes.data || []);
        setProviders(providersRes.data || []);
        setIsDropdownLoading(false);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
        setIsDropdownLoading(false);
      }
    };
    fetchDropdowns();
  }, []);
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

  useEffect(() => {
    const event = eventActions.find((e) => e._id === selectedEventId);
    setSelectedVariables(event?.variables || []);
  }, [selectedEventId, eventActions]);

  const injectIdentifier = (key: string) => {
    const placeholder = `{{${key}}}`;
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = watch("templateBody");
    const newValue =
      text.substring(0, start) + placeholder + text.substring(end);
    setValue("templateBody", newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + placeholder.length,
        start + placeholder.length,
      );
    }, 0);
  };

  const onSubmit = async (values: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = { ...values, userId: user.id || user._id };

    const handleSuccess = async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notification-templates"],
      });
      onClose();
    };
    const handleError = (error: any) => {
      toast.dismiss();

      const errorMessage =
        error?.response?.data?.message || error?.message || "";
      const isDuplicate =
        errorMessage.includes("E11000") ||
        errorMessage.includes("duplicate key");

      if (isDuplicate) {
        toast.error(
          "A template for this Event and Channel already exists. Please edit the existing one instead.",
        );
      } else {
        toast.error("Failed to process the template. Please try again.");
      }
    };

    if (editingData?._id) {
      updateItem(
        { id: editingData._id, payload },
        { onSuccess: handleSuccess, onError: handleError },
      );
    } else {
      createItem(payload, { onSuccess: handleSuccess, onError: handleError });
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Template" : "Add Template"}
      icon={<Bell size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">
              Event Action *
            </label>
            <select
              {...register("eventKeyId")}
              className="p-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-white shadow-sm"
            >
              <option value="">Select Event</option>
              {eventActions.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">
              Channel Provider *
            </label>
            <select
              {...register("channelId")}
              className="p-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-white shadow-sm"
            >
              <option value="">Select Provider</option>
              {providers.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.providerName} ({p.channelId?.channelName || "No Channel"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedVariables.length > 0 && (
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <label className="text-xs font-bold text-indigo-700 uppercase mb-3 block">
              Available Placeholders (Click to Insert)
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedVariables.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => injectIdentifier(v.key)}
                  className="bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm flex items-center gap-1"
                >
                  <Hash size={12} /> {"{{"}
                  {v.key}
                  {"}}"}
                </button>
              ))}
            </div>
          </div>
        )}

        <FormInput
          label="Subject"
          placeholder="Template Subject"
          {...register("subject")}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-700">
            Template Body *
          </label>
          <textarea
            {...register("templateBody")}
            ref={(e) => {
              register("templateBody").ref(e);
              textareaRef.current = e;
            }}
            className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 min-h-[150px] text-sm font-mono leading-relaxed bg-white shadow-sm"
            placeholder="Write your message here..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <FormToggle
                label="Active"
                checked={field.value}
                onChange={field.onChange}
                disabled={isDefaultChecked}
              />
            )}
          />
          <Controller
            control={control}
            name="isDefault"
            render={({ field }) => (
              <FormToggle
                label="Default"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <FormButton
          type="submit"
          label={editingData ? "Update Template" : "Save Template"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default NotificationTemplateForm;
