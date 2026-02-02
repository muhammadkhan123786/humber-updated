"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layers, Save } from "lucide-react";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormSelect } from "@/app/common-form/FormSelect";
import { FormModal } from "@/app/common-form/FormModal";
import { FormButton } from "@/app/common-form/FormButton";
import { useFormActions } from "@/hooks/useFormActions";
import { toast } from "react-hot-toast";
import { getAlls } from "@/helper/apiHelper";
import { IDepartments } from "../../../../../../../common/Ticket-management-system/IDepartment.interface";
import { IPopulatedTicketType } from "./TicketTypeTable";

const ticketTypeFormSchema = z.object({
  code: z.string().trim().min(1, "Enter code please"),
  label: z.string().trim().min(1, "Label is required"),
  departmentId: z.string().min(1, "Please select a department"),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type TicketTypeFormData = z.infer<typeof ticketTypeFormSchema>;

interface Props {
  editingData: IPopulatedTicketType | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
  apiUrl: string;
}

export default function TicketTypeForm({ editingData, onClose, themeColor, apiUrl }: Props) {
  const [departments, setDepartments] = useState<{label: string, value: string}[]>([]);

  const { createItem, updateItem, isSaving } = useFormActions(
    apiUrl,
    "ticketTypes",
    "Ticket Type"
  );

  const { 
    register, 
    handleSubmit, 
    reset, 
    control, 
    setValue, 
    formState: { errors } 
  } = useForm<TicketTypeFormData>({
    resolver: zodResolver(ticketTypeFormSchema),
    defaultValues: { code: "", label: "", departmentId: "", isActive: true, isDefault: false }
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    const loadDeps = async () => {
      const res = await getAlls<IDepartments>("/departments?filter=all");
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
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = { ...values, code: values.code.toUpperCase(), userId: user.id || user._id };
    
    if (editingData?._id) {
      updateItem(
        { id: editingData._id, payload },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Error updating ticket type");
          }
        }
      );
    } else {
      createItem(payload, {
        onSuccess: () => {
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Error creating ticket type");
        }
      });
    }
  };

  return (
    <FormModal title={editingData ? "Edit Ticket Type" : "Add Ticket Type"} icon={<Layers size={24} />} onClose={onClose} themeColor={themeColor}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput label="Type Code *" placeholder="e.g. HARDWARE" {...register("code")} error={errors.code?.message} />
          <FormInput label="Display Label *" placeholder="e.g. Hardware Issue" {...register("label")} error={errors.label?.message} />
        </div>

        <FormSelect 
          label="Assigned Department *" 
          options={departments} 
          {...register("departmentId")} 
          error={errors.departmentId?.message} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <Controller control={control} name="isActive" render={({ field }) => (
            <FormToggle 
              label="Active" 
              checked={field.value} 
              onChange={field.onChange}
              disabled={isDefaultValue} 
            />
          )} />
          <Controller control={control} name="isDefault" render={({ field }) => (
            <FormToggle 
              label="Default" 
              checked={field.value} 
              onChange={(val) => {
                field.onChange(val);
                if (val) setValue("isActive", true); 
              }} 
            />
          )} />
        </div>

        <FormButton 
          type="submit" 
          label={editingData ? "Update Type" : "Create"} 
          loading={isSaving} 
          icon={<Save size={20} />} 
          themeColor={themeColor} 
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
}