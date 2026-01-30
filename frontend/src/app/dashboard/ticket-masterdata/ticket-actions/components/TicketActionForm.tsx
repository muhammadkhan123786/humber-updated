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
import { useFormActions } from "@/hooks/useFormActions";
import { toast } from "react-hot-toast";
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

type TicketActionWithId = ITicketActions & { _id: string };

interface Props {
  editingData: TicketActionWithId | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const TicketActionForm = ({
  editingData,
  onClose,
  themeColor,
}: Props) => {
  const { createItem, updateItem, isSaving } = useFormActions(
    "/ticket-actions",
    "ticketActions",
    "Ticket Action"
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<TicketActionFormData>({
    resolver: zodResolver(ticketActionFormSchema),
    defaultValues: {
      code: "",
      label: "",
      isActive: true,
      isDefault: false,
    },
  });

  // Monitor isDefault state to handle logic for isActive
  const isDefaultValue = useWatch({ control, name: "isDefault" });

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
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    const payload = { ...values, userId: user.id || user._id };

    if (editingData?._id) {
      updateItem(
        { id: editingData._id, payload },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Error updating action");
          }
        }
      );
    } else {
      createItem(payload, {
        onSuccess: () => {
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Error creating action");
        }
      });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                label="Default"
                checked={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  // If default is checked, ensure active is also true
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
          label={editingData ? "Update Action" : "Create"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default TicketActionForm;