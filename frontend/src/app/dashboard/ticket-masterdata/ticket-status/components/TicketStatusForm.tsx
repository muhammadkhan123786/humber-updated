"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Tag } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { createItem, updateItem } from "../../../../../helper/apiHelper";
import { ITicketStatus } from "../../../../../../../common/Ticket-management-system/ITicketStatus.interface";

const ticketStatusFormSchema = z.object({
  code: z.string().trim().min(1, "Status code is required"),
  label: z.string().trim().min(1, "Display label is required"),
  is_Terminal: z.boolean(),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type TicketStatusFormData = z.infer<typeof ticketStatusFormSchema>;

interface Props {
  editingData: (ITicketStatus & { _id?: string }) | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const TicketStatusForm = ({
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TicketStatusFormData>({
    resolver: zodResolver(ticketStatusFormSchema),
    defaultValues: {
      code: "",
      label: "",
      is_Terminal: false,
      isActive: true,
      isDefault: false,
    },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    if (editingData) {
      reset({
        code: editingData.code,
        label: editingData.label,
        is_Terminal: Boolean(editingData.is_Terminal),
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
      });
    }
  }, [editingData, reset]);

  const onSubmit = async (values: TicketStatusFormData) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      const payload = { ...values, userId: user.id || user._id };

      if (editingData?._id) {
        await updateItem("/ticket-status", editingData._id, payload);
      } else {
        await createItem("/ticket-status", payload);
      }
      onRefresh();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error saving data");
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Ticket Status" : "Add Ticket Status"}
      icon={<Tag size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Status Code *"
            placeholder="e.g. OPEN"
            {...register("code")}
            error={errors.code?.message}
          />
          <FormInput
            label="Label *"
            placeholder="e.g. Open"
            {...register("label")}
            error={errors.label?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <Controller
            control={control}
            name="is_Terminal"
            render={({ field }) => (
              <FormToggle
                label="Status"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />

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
          label={editingData ? "Update Status" : "Create"}
          icon={<Save size={20} />}
          loading={isSubmitting}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default TicketStatusForm;