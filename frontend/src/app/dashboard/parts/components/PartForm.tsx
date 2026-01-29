"use client";
import { useEffect } from "react";
import {
  useForm,
  Controller,
  useWatch,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Settings } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { useFormActions } from "@/hooks/useFormActions";

interface IPartFormData {
  partName: string;
  partNumber: string;
  unitCost: number;
  isActive: boolean;
  isDefault: boolean;
}

const partValidation = z.object({
  partName: z.string().min(1, "Part Name is required."),
  partNumber: z.string().min(1, "Part Number is required."),
  unitCost: z.coerce.number().positive("Cost must be positive"),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

const PartForm = ({ editingData, onClose, themeColor }: any) => {
  const { createItem, updateItem, isSaving } = useFormActions(
    "/mobility-parts",
    "parts",
    "Part",
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<IPartFormData>({
    resolver: zodResolver(partValidation) as any,
    defaultValues: {
      partName: "",
      partNumber: "",
      unitCost: 0,
      isActive: true,
      isDefault: false,
    },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    if (editingData) {
      reset({
        partName: editingData.partName || "",
        partNumber: editingData.partNumber || "",
        unitCost: editingData.unitCost || 0,
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
      });
    }
  }, [editingData, reset]);

  const onSubmit: SubmitHandler<IPartFormData> = async (values) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = { ...values, userId: user.id || user._id };

    if (editingData?._id)
      updateItem({ id: editingData._id, payload }, { onSuccess: onClose });
    else createItem(payload, { onSuccess: onClose });
  };

  return (
    <FormModal
      title={editingData ? "Edit Part" : "Add Part"}
      icon={<Settings size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form
        onSubmit={handleSubmit(
          onSubmit as SubmitHandler<IPartFormData> & SubmitHandler<FieldValues>,
        )}
        className="space-y-6 p-4"
      >
        <FormInput
          label="Part Name *"
          placeholder="e.g. Brake Pad"
          {...register("partName")}
          error={errors.partName?.message}
        />
        <FormInput
          label="Part Number *"
          placeholder="e.g. PN-12345"
          {...register("partNumber")}
          error={errors.partNumber?.message}
        />
        <FormInput
          label="Unit Cost *"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("unitCost")}
          error={errors.unitCost?.message}
        />

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
          label={editingData ? "Update Part" : "Create"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default PartForm;
