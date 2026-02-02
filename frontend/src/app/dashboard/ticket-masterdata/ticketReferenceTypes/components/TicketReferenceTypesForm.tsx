"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, BookMarked } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { useFormActions } from "@/hooks/useFormActions";
import { toast } from "react-hot-toast";
import { ITicketReferenceTypes } from "../../../../../../../common/Ticket-management-system/ITicket.reference.types.interface";

const formSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Reference code is required")
    .transform((v) => v.toUpperCase()),
  label: z.string().trim().min(1, "Label is required"),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

type TicketReferenceTypeWithId = ITicketReferenceTypes & { _id: string };

interface Props {
  editingData: TicketReferenceTypeWithId | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const TicketReferenceTypesForm = ({
  editingData,
  onClose,
  themeColor,
}: Props) => {
  const { createItem, updateItem, isSaving } = useFormActions(
    "/ticket-reference-types",
    "ticketReferenceTypes",
    "Ticket Reference Type"
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "", label: "", isActive: true, isDefault: false },
  });

  const isDefaultValue = useWatch({
    control,
    name: "isDefault",
  });

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

  const onSubmit = async (values: FormData) => {
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
            toast.error(error.response?.data?.message || "Error updating reference type");
          }
        }
      );
    } else {
      createItem(payload, {
        onSuccess: () => {
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Error creating reference type");
        }
      });
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Reference Type" : "Add Reference Type"}
      icon={<BookMarked size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Reference Code *"
            placeholder="e.g. EMAIL"
            {...register("code")}
            error={errors.code?.message}
          />
          <FormInput
            label="Label *"
            placeholder="e.g. Email Support"
            {...register("label")}
            error={errors.label?.message}
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
          label={editingData ? "Update Reference Type" : "Create"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default TicketReferenceTypesForm;