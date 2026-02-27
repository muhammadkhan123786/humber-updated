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
import { getAll } from "@/helper/apiHelper";
import { IVehicleModel } from "../types";
import { useFormActions } from "@/hooks/useFormActions";

const modelSchema = z.object({
  brandId: z.string().min(1, "Please select a brand"),
  modelName: z.string().min(1, "Model name is required"),
  isActive: z.boolean(),
  isDefault: z.boolean(),
  isCompany: z.boolean(),
  isRider: z.boolean(),
});

type FormData = z.infer<typeof modelSchema>;

interface Props {
  editingData: IVehicleModel | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const ModalForm = ({ editingData, onClose, themeColor }: Props) => {
  const [brands, setBrands] = useState<{ _id: string; brandName: string }[]>(
    [],
  );

  const { createItem, updateItem, isSaving } = useFormActions(
    "/vechilemodel",
    "vehicleModels",
    "Vehicle Model",
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      isActive: true,
      isDefault: false,
      brandId: "",
      modelName: "",
      isCompany: true,
      isRider: false,
    },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getAll<any>("/vehiclebrand?filter=all", {
          isActive: "true",
        });
        setBrands(res.data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();

    if (editingData) {
      reset({
        brandId:
          typeof editingData.brandId === "object"
            ? (editingData.brandId as any)._id
            : editingData.brandId,
        modelName: editingData.modelName,
        isActive: Boolean(editingData.isActive),
        isDefault: Boolean(editingData.isDefault),
        // Yahan null check zaroori hai
        isCompany:
          editingData.isCompany !== undefined ? editingData.isCompany : true,
        isRider:
          editingData.isRider !== undefined ? editingData.isRider : false,
      });
    }
  }, [editingData, reset]);

  const onSubmit = async (values: FormData) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};

    // Ensure all values are sent
    const payload = {
      ...values,
      userId: user.id || user._id,
    };

    if (editingData?._id) {
      updateItem(
        { id: (editingData as any)._id, payload },
        { onSuccess: onClose },
      );
    } else {
      createItem(payload, { onSuccess: onClose });
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
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Select Brand *
          </label>
          <select
            {...register("brandId")}
            className={`w-full border rounded-xl p-3 outline-none transition-all appearance-none bg-white ${
              errors.brandId ? "border-red-500" : "border-gray-200"
            }`}
          >
            <option value="">Choose a Brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.brandName}
              </option>
            ))}
          </select>
        </div>

        <FormInput
          label="Model Name *"
          placeholder="e.g. Corolla, Civic..."
          {...register("modelName")}
          error={errors.modelName?.message}
        />

        {/* --- New Toggles Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <Controller
            control={control}
            name="isCompany"
            render={({ field }) => (
              <FormToggle
                label="Is Company"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="isRider"
            render={({ field }) => (
              <FormToggle
                label="Is Rider"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          label={editingData ? "Update Model" : "Create"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default ModalForm;
