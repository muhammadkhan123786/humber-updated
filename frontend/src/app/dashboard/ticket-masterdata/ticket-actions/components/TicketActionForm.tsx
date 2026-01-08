"use client";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Settings } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { createItem, updateItem } from "../../../../../helper/apiHelper";
import { ITicketActions } from "../../../../../../../common/Ticket-management-system/ITicketActions.interface";

const ticketActionFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Action code is required")
    .transform((v) => v.toUpperCase()),
  label: z.string().trim().min(1, "Display label is required"),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type TicketActionFormData = z.infer<typeof ticketActionFormSchema>;

interface Props {
  editingData: (ITicketActions & { _id?: string }) | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const TicketActionForm = ({
  editingData,
  onClose,
  onRefresh,
  themeColor,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch, // Added watch
    setValue, // Added setValue
    formState: { errors, isSubmitting },
  } = useForm<TicketActionFormData>({
    resolver: zodResolver(ticketActionFormSchema),
    defaultValues: {
      code: "",
      label: "",
      isActive: true,
      isDefault: false,
    },
  });

  // isDefault ki current value ko monitor karein
  const isDefaultValue = watch("isDefault");

  useEffect(() => {
    if (editingData) {
      reset({
        code: editingData.code,
        label: editingData.label,
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
      });
    }
  }, [editingData, reset]);

  const onSubmit = async (values: TicketActionFormData) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      const payload = { ...values, userId: user.id || user._id };

      if (editingData?._id) {
        await updateItem("/ticket-actions", editingData._id, payload);
      } else {
        await createItem("/ticket-actions", payload);
      }
      onRefresh();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || "Error saving action");
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Ticket Action" : "Add Ticket Action"}
      icon={<Settings size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <div className="grid grid-cols-1 gap-6">
          <FormInput
            label="Action Code *"
            placeholder="e.g. REASSIGN"
            {...register("code")}
            error={errors.code?.message}
          />
          <FormInput
            label="Display Label *"
            placeholder="e.g. Reassign Ticket"
            {...register("label")}
            error={errors.label?.message}
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
               
                disabled={isDefaultValue}
              />
            )}
          />
          <Controller
            control={control}
            name="isDefault"
            render={({ field }) => (
              <FormToggle
                label="Default Action"
                checked={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  // Jab default select ho, toh active ko true kar dein
                  if (val) {
                    setValue("isActive", true);
                  }
                }}
              />
            )}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: themeColor }}
        >
          <Save size={20} />
          {isSubmitting ? "Saving..." : "Save Action"}
        </button>
      </form>
    </FormModal>
  );
};

export default TicketActionForm;