"use client";
import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Settings, X, Plus } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { FormSelect } from "@/app/common-form/FormSelect";
import { useFormActions } from "@/hooks/useFormActions";
import { getAll } from "@/helper/apiHelper";

// Make fields required in the schema
const fieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  label: z.string().min(1, "Field label is required"),
  type: z.enum(["text", "password", "number", "select", "boolean"]),
  required: z.boolean().optional().default(false),
  placeholder: z.string().optional().default(""),
  options: z.array(z.string()).optional().default([]),
});

const configSchemaValidation = z.object({
  providerId: z.string().min(1, "Please select a provider."),
  fields: z.array(fieldSchema),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

type FormData = z.infer<typeof configSchemaValidation>;

interface Props {
  editingData: any | null;
  onClose: () => void;
  onRefresh?: () => void;
  themeColor: string;
}

interface Provider {
  _id: string;
  providerName: string;
  channelId: any;
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "password", label: "Password" },
  { value: "number", label: "Number" },
  { value: "select", label: "Select" },
  { value: "boolean", label: "Boolean (Yes/No)" },
];

const defaultField = {
  name: "",
  label: "",
  type: "" as "text" | "password" | "number" | "select" | "boolean",
  required: false,
  placeholder: "",
  options: [],
};

const ChannelProviderConfigForm = ({
  editingData,
  onClose,
  themeColor,
}: Props) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  console.log(loadingProviders);
  const { createItem, updateItem, isSaving } = useFormActions(
    "/channel-providers-fields",
    "channelProviderConfigs",
    "Configuration",
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(configSchemaValidation) as any,
    defaultValues: {
      providerId: "",
      fields: [defaultField],
      isActive: true,
      isDefault: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const watchFields = watch("fields");
  const isDefaultValue = watch("isDefault");
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoadingProviders(true);
        const providersRes = await getAll<Provider>(
          "/channel-providers?filter=all",
          { limit: "1000" },
        );
        setProviders(providersRes.data || []);
      } catch (error) {
        console.error("Error fetching providers:", error);
      } finally {
        setLoadingProviders(false);
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    if (editingData) {
      const providerId =
        typeof editingData.providerId === "object"
          ? editingData.providerId?._id
          : editingData.providerId;

      reset({
        providerId: providerId || "",
        fields: editingData.fields?.length
          ? editingData.fields
          : [defaultField],
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

  const addOption = (fieldIndex: number, option: string) => {
    if (!option.trim()) return;
    const currentOptions = watchFields[fieldIndex].options || [];
    setValue(
      `fields.${fieldIndex}.options`,
      [...currentOptions, option.trim()],
      {
        shouldValidate: true,
      },
    );
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const currentOptions = watchFields[fieldIndex].options || [];
    setValue(
      `fields.${fieldIndex}.options`,
      currentOptions.filter((_, i) => i !== optionIndex),
      { shouldValidate: true },
    );
  };

  const addField = () => {
    append(defaultField);
  };

  const getProviderOptionLabel = (provider: Provider) => {
    let channelName = "Unknown Channel";

    if (provider.channelId && typeof provider.channelId === "object") {
      channelName = provider.channelId.channelName || "Unknown Channel";
    } else if (provider.channelId && typeof provider.channelId === "string") {
      channelName = `ID: ${provider.channelId.substring(0, 8)}...`;
    }

    return `${provider.providerName} (${channelName})`;
  };

  return (
    <FormModal
      title={editingData ? "Edit Configuration" : "Add Configuration"}
      icon={<Settings size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormSelect
          label="Select Provider *"
          options={providers.map((p) => ({
            value: p._id,
            label: getProviderOptionLabel(p),
          }))}
          {...register("providerId")}
          value={watch("providerId")}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setValue("providerId", e.target.value, { shouldValidate: true })
          }
          error={errors.providerId?.message}
        />

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Configuration Fields
            </h3>
            <button
              type="button"
              onClick={addField}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
            >
              <Plus size={16} /> Add Field
            </button>
          </div>

          {fields.map((field, fieldIndex) => (
            <div
              key={field.id}
              className="p-4 border border-blue-200 rounded-xl bg-blue-50/30 space-y-4 relative"
            >
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(fieldIndex)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm"
                >
                  <X size={16} />
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Field Name *"
                  placeholder="e.g., api_key"
                  {...register(`fields.${fieldIndex}.name`)}
                  error={errors.fields?.[fieldIndex]?.name?.message}
                />
                <FormInput
                  label="Field Label *"
                  placeholder="e.g., API Key"
                  {...register(`fields.${fieldIndex}.label`)}
                  error={errors.fields?.[fieldIndex]?.label?.message}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormSelect
                  label="Field Type *"
                  options={fieldTypes}
                  {...register(`fields.${fieldIndex}.type`)}
                  value={watch(`fields.${fieldIndex}.type`)}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setValue(
                      `fields.${fieldIndex}.type`,
                      e.target.value as any,
                      {
                        shouldValidate: true,
                      },
                    )
                  }
                  error={errors.fields?.[fieldIndex]?.type?.message}
                />

                <FormInput
                  label="Placeholder"
                  placeholder="Enter placeholder text"
                  {...register(`fields.${fieldIndex}.placeholder`)}
                  error={errors.fields?.[fieldIndex]?.placeholder?.message}
                />
              </div>

              {watch(`fields.${fieldIndex}.type`) === "select" && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Options
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none"
                      placeholder="Enter option and press Add"
                      id={`option-input-${fieldIndex}`}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = document.getElementById(
                            `option-input-${fieldIndex}`,
                          ) as HTMLInputElement;
                          addOption(fieldIndex, input.value);
                          input.value = "";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById(
                          `option-input-${fieldIndex}`,
                        ) as HTMLInputElement;
                        addOption(fieldIndex, input.value);
                        input.value = "";
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {watchFields[fieldIndex].options &&
                    watchFields[fieldIndex].options!.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {watchFields[fieldIndex].options!.map(
                          (opt, optIndex) => (
                            <span
                              key={optIndex}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm"
                            >
                              {opt}
                              <button
                                type="button"
                                onClick={() =>
                                  removeOption(fieldIndex, optIndex)
                                }
                                className="hover:text-red-600 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ),
                        )}
                      </div>
                    )}
                </div>
              )}

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    {...register(`fields.${fieldIndex}.required`)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Required field
                </label>
              </div>
            </div>
          ))}
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
                  if (val) setValue("isActive", true, { shouldValidate: true });
                }}
              />
            )}
          />
        </div>

        <FormButton
          type="submit"
          label={editingData ? "Update Configuration" : "Create Configuration"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default ChannelProviderConfigForm;
