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
import { ITicketStatus } from "../../../../../../../common/Ticket-management-system/ITicketStatus.interface";
import { useFormActions } from "@/hooks/useFormActions";

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
  themeColor,
}: Props) => {
  // Hook call
  const { createItem, updateItem, isSaving } = useFormActions(
    "/ticket-status",
    "ticketStatuses",
    "Ticket Status"
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
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
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    const payload = { ...values, userId: user.id || user._id };

    if (editingData?._id) {
      // Update Mutation
      updateItem(
        { id: editingData._id, payload },
        {
          onSuccess: () => {
            onClose();
          }
        }
      );
    } else {
      // Create Mutation
      createItem(payload, {
        onSuccess: () => {
          onClose();
        }
      });
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
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default TicketStatusForm;