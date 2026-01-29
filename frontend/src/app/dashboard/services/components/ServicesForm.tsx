"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Settings } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { IServiceType } from "../types";
import { useFormActions } from "@/hooks/useFormActions";

const schema = z.object({
  MasterServiceType: z.string().min(1, "Service type name is required."),
  description: z.string().optional(),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  editingData: (IServiceType & { _id?: string }) | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const ServicesForm = ({ editingData, onClose, themeColor }: Props) => {
  const { createItem, updateItem, isSaving } = useFormActions(
    "/service-types-master",
    "serviceTypes",
    "Service Type"
  );
  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { MasterServiceType: "", description: "", isActive: true, isDefault: false },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    if (editingData) {
      reset({
        MasterServiceType: editingData.MasterServiceType,
        description: editingData.description || "",
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
      updateItem(
        { id: editingData._id, payload },
        { onSuccess: onClose }
      );
    } else {
      createItem(payload, { onSuccess: onClose });
    }
  };

  return (
    <FormModal title={editingData ? "Edit Service" : "Add Service Type"} icon={<Settings size={24} />} onClose={onClose} themeColor={themeColor}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormInput label="Service Type Name *" placeholder="e.g. Oil Change" {...register("MasterServiceType")} error={errors.MasterServiceType?.message} />
        
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
          <textarea className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200 h-24 resize-none" {...register("description")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <Controller control={control} name="isActive" render={({ field }) => (
            <FormToggle label="Active" checked={field.value} onChange={field.onChange} disabled={isDefaultValue} />
          )} />
          <Controller control={control} name="isDefault" render={({ field }) => (
            <FormToggle label="Default" checked={field.value} onChange={(val) => { field.onChange(val); if (val) setValue("isActive", true); }} />
          )} />
        </div>

        <FormButton type="submit" label={editingData ? "Update Service" : "Create"} icon={<Save size={20} />} loading={isSaving} themeColor={themeColor} onCancel={onClose} />
      </form>
    </FormModal>
  );
};

export default ServicesForm;