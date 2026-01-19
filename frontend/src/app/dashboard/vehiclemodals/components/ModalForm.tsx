"use client";
import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, CarFront } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { createItem, updateItem, getAll } from "@/helper/apiHelper";
import { IVehicleModel } from "../types";

const modelSchema = z.object({
  brandId: z.string().min(1, "Please select a brand"),
  modelName: z.string().min(1, "Model name is required"),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type FormData = z.infer<typeof modelSchema>;

interface Props {
  editingData: IVehicleModel | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const ModalForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
  const [brands, setBrands] = useState<{ _id: string; brandName: string }[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      isActive: true,
      isDefault: false,
      brandId: "",
      modelName: "",
    },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getAll<any>("/vehiclebrand", { isActive: "true" });
        setBrands(res.data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();

    if (editingData) {
      reset({
        brandId: typeof editingData.brandId === "object" ? editingData.brandId._id : editingData.brandId,
        modelName: editingData.modelName,
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
        await updateItem("/vechilemodel", editingData._id, payload);
      } else {
        await createItem("/vechilemodel", payload);
      }
      onRefresh();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error saving model");
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Vehicle Model" : "Add Vehicle Model"}
      icon={<CarFront size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        {/* Brand Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Select Brand *
          </label>
          <select
            {...register("brandId")}
            className={`w-full border rounded-xl p-3 outline-none transition-all appearance-none bg-white ${
              errors.brandId
                ? "border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
            }`}
          >
            <option value="">Choose a Brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.brandName}
              </option>
            ))}
          </select>
          {errors.brandId && (
            <p className="text-red-500 text-xs mt-1">{errors.brandId.message}</p>
          )}
        </div>

        {/* Model Name */}
        <FormInput
          label="Model Name *"
          placeholder="e.g. Corolla, Civic..."
          {...register("modelName")}
          error={errors.modelName?.message}
        />

        {/* Status Toggles */}
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

        {/* Action Buttons */}
        <FormButton
          type="submit"
          label={editingData ? "Update Model" : "Create"}
          icon={<Save size={20} />}
          loading={isSubmitting}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default ModalForm;