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
import { IAvailability } from "../../../../../../common/IAvailibility.interface";
import { useFormActions } from "@/hooks/useFormActions";

const availabilitySchemaValidation = z.object({
  availabilityName: z.string().min(1, "Availability name is required."),
  fromTime: z.string().min(1, "Start time is required."),
  toTime: z.string().min(1, "End time is required."),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type FormData = z.infer<typeof availabilitySchemaValidation>;

interface Props {
  editingData: (IAvailability & { _id?: string }) | null;
  onClose: () => void;
  themeColor: string;
}

const AvailabilityForm = ({ editingData, onClose, themeColor }: Props) => {
  const { createItem, updateItem, isSaving } = useFormActions(
    "/availability",
    "availability",
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
    resolver: zodResolver(availabilitySchemaValidation),
    defaultValues: {
      availabilityName: "",
      fromTime: "",
      toTime: "",
      isActive: true,
      isDefault: false,
    },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    if (editingData) {
      reset({
        availabilityName: editingData.availabilityName,
        fromTime: editingData.fromTime,
        toTime: editingData.toTime,
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
      });
    }
  }, [editingData, reset]);

  const onSubmit = async (values: FormData) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    const payload = { ...values, userId: user.id || user._id };

    if (editingData?._id) {
      updateItem({ id: editingData._id, payload }, { onSuccess: onClose });
    } else {
      createItem(payload, { onSuccess: onClose });
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Availability" : "Add Availability"}
      icon={<Clock size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormInput
          label="Availability Name *"
          placeholder="e.g. Morning Shift"
          {...register("availabilityName")}
          error={errors.availabilityName?.message}
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
          label={editingData ? "Update Slot" : "Create Slot"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default AvailabilityForm;
