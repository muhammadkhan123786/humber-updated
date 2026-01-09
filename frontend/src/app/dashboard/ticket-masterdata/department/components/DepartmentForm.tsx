"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Save } from "lucide-react";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormModal } from "@/app/common-form/FormModal";
import { FormButton } from "@/app/common-form/FormButton";
import { createItem, updateItem } from "@/helper/apiHelper";
import { IDepartments } from "../../../../../../../common/Ticket-management-system/IDepartment.interface";

// 1. Zod Schema
const departmentFormSchema = z.object({
  departmentName: z
    .string()
    .trim()
    .min(3, "Department name must be at least 3 characters"),
  isActive: z.boolean(),
  isDefault: z.boolean(),
  userId: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof departmentFormSchema>;

interface Props {
  editingData: (IDepartments & { _id?: string }) | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
  apiUrl: string;
}

const DepartmentForm = ({
  editingData,
  onClose,
  onRefresh,
  themeColor,
  apiUrl,
}: Props) => {
  // 3. React Hook Form Setup (Added watch & setValue)
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      departmentName: "",
      isActive: true,
      isDefault: false,
      userId: "",
    },
  });

  // isDefault ki value ko watch karein
  const isDefaultValue = watch("isDefault");

  // 4. Sync editingData with reset
  useEffect(() => {
    if (editingData) {
      reset({
        departmentName: editingData.departmentName,
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
        userId:
          typeof editingData.userId === "string" ? editingData.userId : "",
      });
    }
  }, [editingData, reset]);

  // 5. Submit Handler
  const onSubmit = async (values: DepartmentFormData) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      const userId = user.id || user._id;

      const payload = {
        ...values,
        userId: userId,
      };

      if (editingData?._id) {
        await updateItem(apiUrl, editingData._id, payload);
      } else {
        await createItem(apiUrl, payload);
      }
      onRefresh();
      onClose();
    } catch (error: any) {
      alert(
        error.response?.data?.message || error.message || "Error saving data"
      );
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Department" : "Add Department"}
      icon={<Building2 size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <div className="grid grid-cols-1 gap-6">
          <FormInput
            label="Department Name *"
            placeholder="e.g. IT Support"
            {...register("departmentName")}
            error={errors.departmentName?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <FormToggle
                label="Active"
                checked={field.value}
                onChange={field.onChange}
                // FIXED: Agar Default true hai to isActive disable ho jaye
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
                  // LOGIC: Agar isko default banaya jaye to isActive khud ba khud true ho jaye
                  if (val) {
                    setValue("isActive", true);
                  }
                }}
              />
            )}
          />
        </div>

        <FormButton
          type="submit"
          label={editingData ? "Update Department" : "Save Department"}
          loading={isSubmitting}
          icon={<Save size={20} />}
          themeColor={themeColor}
        />
      </form>
    </FormModal>
  );
};

export default DepartmentForm;
