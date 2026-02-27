"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Clock } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { useFormActions } from "@/hooks/useFormActions";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const availabilitySchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    fromTime: z.string().regex(timeRegex, "Use HH:mm (24h) format"),
    toTime: z.string().regex(timeRegex, "Use HH:mm (24h) format"),
    isActive: z.boolean(),
    isDefault: z.boolean(),
  })
  .refine((data) => data.fromTime < data.toTime, {
    message: "Start time must be earlier than end time",
    path: ["toTime"],
  });

type FormData = z.infer<typeof availabilitySchema>;

interface Props {
  editingData: any | null;
  onClose: () => void;
  themeColor: string;
}

const AvailabilitieForm = ({ editingData, onClose, themeColor }: Props) => {
  const { createItem, updateItem, isSaving } = useFormActions(
    "/rider-availabilities",
    "riderAvailabilities",
    "Availability",
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      name: "",
      fromTime: "09:00",
      toTime: "18:00",
      isActive: true,
      isDefault: false,
    },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    if (editingData) {
      reset({
        ...editingData,
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
      });
    }
  }, [editingData, reset]);

  const onSubmit = async (values: FormData) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = { ...values, userId: user.id || user._id };

    if (editingData?._id) {
      updateItem({ id: editingData._id, payload }, { onSuccess: onClose });
    } else {
      createItem(payload, { onSuccess: onClose });
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Shift" : "Add Shift"}
      icon={<Clock size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormInput
          label="Shift Name *"
          placeholder="e.g. Morning Shift"
          {...register("name")}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="From Time *"
            type="time"
            {...register("fromTime")}
            error={errors.fromTime?.message}
          />
          <FormInput
            label="To Time *"
            type="time"
            {...register("toTime")}
            error={errors.toTime?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
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
                label="Default"
                checked={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  if (val) setValue("isActive", true);
                }}
              />
            )}
          />
        </div>

        <FormButton
          type="submit"
          label={editingData ? "Update Shift" : "Create"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default AvailabilitieForm;
