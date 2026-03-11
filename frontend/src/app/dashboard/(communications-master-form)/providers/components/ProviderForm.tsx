"use client";
import { useState, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Activity } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { FormSelect } from "@/app/common-form/FormSelect";
import { useFormActions } from "@/hooks/useFormActions";
import { getAll } from "@/helper/apiHelper";

interface EditingDataProvider {
  _id?: string;
  providerName?: string;
  channelId?: string | { _id: string; channelName: string };
  isActive?: boolean;
  isDefault?: boolean;
}

const providerSchemaValidation = z.object({
  providerName: z.string().min(1, "Provider name is required."),
  channelId: z.string().min(1, "Please select a channel."),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type FormData = z.infer<typeof providerSchemaValidation>;

interface Props {
  editingData: EditingDataProvider | null;
  onClose: () => void;
  onRefresh?: () => void;
  themeColor: string;
}

interface Channel {
  _id: string;
  channelName: string;
}

const ProviderForm = ({ editingData, onClose, themeColor }: Props) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(false);

  const { createItem, updateItem, isSaving } = useFormActions(
    "/channel-providers",
    "channelProviders",
    "Provider",
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(providerSchemaValidation),
    defaultValues: {
      providerName: "",
      channelId: "",
      isActive: true,
      isDefault: false,
    },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });
  const selectedChannelId = useWatch({ control, name: "channelId" });
  console.log(loadingChannels);
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoadingChannels(true);
        const response = await getAll<Channel>("/channels?filter=all", {
          limit: "1000",
        });
        setChannels(response.data || []);
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoadingChannels(false);
      }
    };
    fetchChannels();
  }, []);

  useEffect(() => {
    if (editingData) {
      const cid =
        typeof editingData.channelId === "object"
          ? editingData.channelId?._id
          : editingData.channelId;

      reset({
        providerName: editingData.providerName || "",
        channelId: cid || "",
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
      title={editingData ? "Edit Provider" : "Add Provider"}
      icon={<Activity size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormInput
          label="Provider Name *"
          placeholder="e.g. Twilio, MessageBird"
          {...register("providerName")}
          error={errors.providerName?.message}
        />
        <FormSelect
          label="Select Channel *"
          options={channels.map((ch) => ({
            value: ch._id,
            label: ch.channelName,
          }))}
          {...register("channelId")}
          value={selectedChannelId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setValue("channelId", e.target.value)
          }
          error={errors.channelId?.message}
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
          label={editingData ? "Update Provider" : "Create Provider"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default ProviderForm;
