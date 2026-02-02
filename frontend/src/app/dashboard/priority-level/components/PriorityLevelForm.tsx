"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, AlertTriangle, Check } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { useFormActions } from "@/hooks/useFormActions";
import { toast } from "react-hot-toast";

// 1. Define the interface strictly
interface IPriorityFormData {
  serviceRequestPrioprity: string;
  description: string;
  backgroundColor: string;
  index: number;
  isActive: boolean;
  isDefault: boolean;
}

const PRESET_COLORS = [
  "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)", // Sunset
  "linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)", // Orange
  "linear-gradient(135deg, #F09819 0%, #EDDE5D 100%)", // Gold
  "linear-gradient(135deg, #1D976C 0%, #93F9B9 100%)", // Emerald
  "linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)", // Ocean
  "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)", // Royal
  "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)", // Violet
  "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)", // Pink
  "linear-gradient(135deg, #485563 0%, #29323c 100%)", // Slate
];

// 2. Schema with coercion
const prioritySchemaValidation = z.object({
  serviceRequestPrioprity: z.string().min(1, "Priority name is required."),
  description: z.string().min(1, "Description is required."),
  backgroundColor: z.string().min(1, "Please select a color."),
  index: z.coerce.number().int().positive("Index must be a positive number"),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

interface IPriorityLevelWithId extends IPriorityFormData {
  _id?: string;
}

interface Props {
  editingData: IPriorityLevelWithId | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const PriorityLevelForm = ({ editingData, onClose, themeColor }: Props) => {
  const { createItem, updateItem, isSaving } = useFormActions(
    "/service-request-prioprity-level",
    "priorityLevels",
    "Priority Level"
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<IPriorityFormData>({
    resolver: zodResolver(prioritySchemaValidation) as any,
    defaultValues: {
      serviceRequestPrioprity: "",
      description: "",
      backgroundColor: "#EF4444",
      index: 1,
      isActive: true,
      isDefault: false,
    },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });
  const selectedColor = useWatch({ control, name: "backgroundColor" });

  useEffect(() => {
    if (editingData) {
      reset({
        serviceRequestPrioprity: editingData.serviceRequestPrioprity || "",
        description: editingData.description || "",
        backgroundColor: editingData.backgroundColor || "#EF4444",
        index: editingData.index ?? 1,
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
      });
    }
  }, [editingData, reset]);

  const onSubmit: SubmitHandler<IPriorityFormData> = async (values) => {
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
            let errorMessage = "Error updating priority level";
            if (error.response?.data?.message) {
              const rawMessage = error.response.data.message;
              if (rawMessage.includes("E11000") && rawMessage.includes("index")) {
                errorMessage = `Duplicate Index Error: The index number "${values.index}" is already in use.`;
              } else {
                errorMessage = rawMessage;
              }
            }
            toast.error(errorMessage);
          }
        }
      );
    } else {
      createItem(payload, {
        onSuccess: () => {
          onClose();
        },
        onError: (error: any) => {
          let errorMessage = "Error creating priority level";
          if (error.response?.data?.message) {
            const rawMessage = error.response.data.message;
            if (rawMessage.includes("E11000") && rawMessage.includes("index")) {
              errorMessage = `Duplicate Index Error: The index number "${values.index}" is already in use.`;
            } else {
              errorMessage = rawMessage;
            }
          }
          toast.error(errorMessage);
        }
      });
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <FormInput
              label="Priority Name *"
              placeholder="e.g. High"
              {...register("serviceRequestPrioprity")}
              error={errors.serviceRequestPrioprity?.message}
            />
          </div>
          <div className="md:col-span-1">
            <FormInput
              label="Index *"
              type="number"
              placeholder="1"
              {...register("index", {
                valueAsNumber: true,
                required: "Index is required"
              })}
              error={errors.index?.message}
            />
          </div>
        </div>

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
    // CHANGE: Use 'background' instead of 'backgroundColor'
    style={{ background: color }} 
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
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default PriorityLevelForm;