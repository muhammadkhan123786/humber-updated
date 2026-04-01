"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Phone } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { useFormActions } from "@/hooks/useFormActions";
import { toast } from "react-hot-toast";

const callTypeSchemaValidation = z.object({
  callTypeName: z.string().min(1, "Call Type name is required."),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type FormData = z.infer<typeof callTypeSchemaValidation>;
type CallTypeWithId = {
  _id: string;
  callTypeName: string;
  isActive: boolean;
  isDefault: boolean;
};

interface Props {
  editingData: CallTypeWithId | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const CallTypeForm = ({ editingData, onClose, themeColor }: Props) => {
  const { createItem, updateItem, isSaving } = useFormActions(
    "/call-types",
    "callTypes",
    "Call Type",
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(callTypeSchemaValidation),
    defaultValues: {
      callTypeName: "",
      isActive: true,
      isDefault: false,
    },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    if (editingData) {
      reset({
        callTypeName: editingData.callTypeName,
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
          onSuccess: () => onClose(),
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message || "Error updating call type",
            );
          },
        },
      );
    } else {
      createItem(payload, {
        onSuccess: () => onClose(),
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Error creating call type",
          );
        },
      });
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Call Type" : "Add Call Type"}
      icon={<Phone size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormInput
          label="Call Type Name *"
          placeholder="e.g. Inquiry, Complaint, Support"
          {...register("callTypeName")}
          error={errors.callTypeName?.message}
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
          label={editingData ? "Update Call Type" : "Create"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default CallTypeForm;
