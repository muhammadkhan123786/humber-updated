"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, AlertTriangle, Check } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { createItem, updateItem } from "@/helper/apiHelper";

const PRESET_COLORS = [
  "#EF4444", "#F97316", "#F59E0B", "#10B981", "#06B6D4", "#3B82F6",
  "#6366F1", "#8B5CF6", "#D946EF", "#F43F5E", "#64748B", "#475569",
];

const prioritySchemaValidation = z.object({
  serviceRequestPrioprity: z.string().min(1, "Priority name is required."),
  description: z.string().min(1, "Description is required."),
  backgroundColor: z.string().min(1, "Please select a color."),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type FormData = z.infer<typeof prioritySchemaValidation>;

interface Props {
  editingData: any | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const PriorityLevelForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(prioritySchemaValidation),
    defaultValues: {
      serviceRequestPrioprity: "",
      description: "",
      backgroundColor: "#EF4444",
      isActive: true,
      isDefault: false,
    },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });
  const selectedColor = useWatch({ control, name: "backgroundColor" });

  useEffect(() => {
    if (editingData) {
      reset({
        serviceRequestPrioprity: editingData.serviceRequestPrioprity,
        description: editingData.description,
        backgroundColor: editingData.backgroundColor,
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
      });
    }
  }, [editingData, reset]);

  const onSubmit = async (values: FormData) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      const payload = { ...values, userId: user.id || user._id };

      if (editingData?._id) {
        await updateItem("/service-request-prioprity-level", editingData._id, payload);
      } else {
        await createItem("/service-request-prioprity-level", payload);
      }
      onRefresh();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error saving data");
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Priority" : "Add Priority Level"}
      icon={<AlertTriangle size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormInput
          label="Priority Name *"
          placeholder="e.g. High"
          {...register("serviceRequestPrioprity")}
          error={errors.serviceRequestPrioprity?.message}
        />

        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Description *</label>
            <textarea
                {...register("description")}
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 h-20 resize-none transition-all"
                placeholder="Describe urgency..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Label Color *</label>
          <div className="grid grid-cols-6 gap-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue("backgroundColor", color)}
                className={`w-10 h-10 rounded-xl border-2 shadow-sm flex items-center justify-center transition-all ${
                  selectedColor === color ? "border-gray-800 scale-110" : "border-white"
                }`}
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && <Check size={18} className="text-white drop-shadow-md" />}
              </button>
            ))}
          </div>
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
          label={editingData ? "Update Priority" : "Create"}
          icon={<Save size={20} />}
          loading={isSubmitting}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default PriorityLevelForm;