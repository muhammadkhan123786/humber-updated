"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Radio } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { useFormActions } from "@/hooks/useFormActions";

const channelSchemaValidation = z.object({
  channelName: z.string().min(1, "Please enter channel name."),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type FormData = z.infer<typeof channelSchemaValidation>;

interface Props {
  editingData: any;
  onClose: () => void;
  themeColor: string;
}

const ChannelsForm = ({ editingData, onClose, themeColor }: Props) => {
  const { createItem, updateItem, isSaving } = useFormActions(
    "/channels",
    "channels",
    "Channel",
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(channelSchemaValidation),
    defaultValues: { channelName: "", isActive: true, isDefault: false },
  });

  const isDefaultValue = useWatch({
    control,
    name: "isDefault",
  });

  useEffect(() => {
    if (editingData) {
      reset({
        channelName: editingData.channelName,
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
      });
    }
  }, [editingData, reset]);

  const onSubmit = async (values: FormData) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    const payload = {
      ...values,
      userId: user.id || user._id,
      isDeleted: false,
    };

    if (editingData?._id) {
      updateItem({ id: editingData._id, payload }, { onSuccess: onClose });
    } else {
      createItem(payload, { onSuccess: onClose });
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Channel" : "Add Channel"}
      icon={<Radio size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormInput
          label="Channel Name *"
          placeholder="e.g. WhatsApp, Email"
          {...register("channelName")}
          error={errors.channelName?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
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
                label="Set as Default"
                checked={field.value}
                onChange={(v) => {
                  field.onChange(v);
                  if (v) setValue("isActive", true);
                }}
              />
            )}
          />
        </div>

        <FormButton
          type="submit"
          label={editingData ? "Update Channel" : "Create Channel"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default ChannelsForm;
