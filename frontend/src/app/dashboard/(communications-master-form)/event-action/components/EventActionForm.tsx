"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Zap } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { useFormActions } from "@/hooks/useFormActions";

const eventActionValidation = z.object({
  eventKey: z.string().min(1, "Please enter event key."),
  name: z.string().min(1, "Please enter event name."),
  description: z.string().min(1, "Please enter description."),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type FormData = z.infer<typeof eventActionValidation>;

interface Props {
  editingData: any;
  onClose: () => void;
  themeColor: string;
}

const EventActionForm = ({ editingData, onClose, themeColor }: Props) => {
  const { createItem, updateItem, isSaving } = useFormActions(
    "/event-action",
    "event-actions",
    "Event Action",
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(eventActionValidation),
    defaultValues: {
      eventKey: "",
      name: "",
      description: "",
      isActive: true,
      isDefault: false,
    },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    if (editingData) {
      reset({
        eventKey: editingData.eventKey,
        name: editingData.name,
        description: editingData.description,
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
      });
    }
  }, [editingData, reset]);

  const onSubmit = async (values: FormData) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    const payload = {
      ...values,
      userId: user.id || user._id,
      isDeleted: false,
    };

    if (editingData?._id) {
      updateItem({ id: editingData._id, payload }, { onSuccess: onClose });
    } else {
      createItem(payload, { onSuccess: onClose });
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Event Action" : "Add Event Action"}
      icon={<Zap size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormInput
          label="Event Key *"
          placeholder="e.g. ORDER_CREATED"
          {...register("eventKey")}
          error={errors.eventKey?.message}
        />

        <FormInput
          label="Event Name *"
          placeholder="e.g. New Order Notification"
          {...register("name")}
          error={errors.name?.message}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Description *
          </label>
          <textarea
            {...register("description")}
            name="description"
            className={`w-full p-3 rounded-lg border ${
              errors.description ? "border-red-500" : "border-gray-200"
            } outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] text-sm`}
            placeholder="Describe when this event triggers..."
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <FormToggle
                label="Active"
                checked={field.value}
                onChange={field.onChange}
                disabled={isDefaultValue}
              />
            )}
          />
          <Controller
            control={control}
            name="isDefault"
            render={({ field }) => (
              <FormToggle
                label="Set as Default"
                checked={field.value}
                onChange={(v) => {
                  field.onChange(v);
                  if (v) setValue("isActive", true);
                }}
              />
            )}
          />
        </div>

        <FormButton
          type="submit"
          label={editingData ? "Update Event" : "Create Event"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default EventActionForm;
