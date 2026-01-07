"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layers, Save } from "lucide-react";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormSelect } from "@/app/common-form/FormSelect";
import { FormModal } from "@/app/common-form/FormModal";
import { FormButton } from "@/app/common-form/FormButton";
import { createItem, updateItem, getAlls } from "@/helper/apiHelper";
import { ITicketType } from "../../../../../../../common/Ticket-management-system/ITicketType.interface";
import { IDepartments } from "../../../../../../../common/Ticket-management-system/IDepartment.interface";

const ticketTypeFormSchema = z.object({
  code: z.string().trim().min(1, "Enter code please"),
  label: z.string().trim().min(1, "Label is required"),
  departmentId: z.string().min(1, "Please select a department"),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type TicketTypeFormData = z.infer<typeof ticketTypeFormSchema>;

export default function TicketTypeForm({ editingData, onClose, onRefresh, themeColor, apiUrl }: any) {
  const [departments, setDepartments] = useState<{label: string, value: string}[]>([]);

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<TicketTypeFormData>({
    resolver: zodResolver(ticketTypeFormSchema),
    defaultValues: { code: "", label: "", departmentId: "", isActive: true, isDefault: false }
  });

  useEffect(() => {
    // Fetch Departments for Dropdown
    const loadDeps = async () => {
      const res = await getAlls<IDepartments>("/departments");
      const formatted = res.data.map(d => ({ label: d.departmentName, value: d._id! }));
      setDepartments(formatted);
    };
    loadDeps();

    if (editingData) {
      reset({
        code: editingData.code,
        label: editingData.label,
        departmentId: typeof editingData.departmentId === 'object' ? editingData.departmentId._id : editingData.departmentId,
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
      });
    }
  }, [editingData, reset]);

  const onSubmit = async (values: TicketTypeFormData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = { ...values, code: values.code.toUpperCase(), userId: user.id || user._id };
      
      editingData?._id 
        ? await updateItem(apiUrl, editingData._id, payload)
        : await createItem(apiUrl, payload);
        
      onRefresh();
      onClose();
    } catch (err: any) {
      alert(err.message || "Error saving data");
    }
  };

  return (
    <FormModal title={editingData ? "Edit Ticket Type" : "Add Ticket Type"} icon={<Layers size={24} />} onClose={onClose} themeColor={themeColor}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Type Code *" placeholder="e.g. HARDWARE" {...register("code")} error={errors.code?.message} />
          <FormInput label="Display Label *" placeholder="e.g. Hardware Issue" {...register("label")} error={errors.label?.message} />
        </div>

        <FormSelect 
          label="Assigned Department *" 
          options={departments} 
          {...register("departmentId")} 
          error={errors.departmentId?.message} 
        />

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <Controller control={control} name="isActive" render={({ field }) => (
            <FormToggle label="Active" checked={field.value} onChange={field.onChange} />
          )} />
          <Controller control={control} name="isDefault" render={({ field }) => (
            <FormToggle label="Default" checked={field.value} onChange={field.onChange} />
          )} />
        </div>

        <FormButton type="submit" label="Save Ticket Type" loading={isSubmitting} icon={<Save size={20} />} themeColor={themeColor} />
      </form>
    </FormModal>
  );
}