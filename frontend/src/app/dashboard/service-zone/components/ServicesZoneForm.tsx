"use client";
import React, { useEffect } from "react";
import { Save, Map } from "lucide-react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { createItem, updateItem } from "@/helper/apiHelper";
import { IServicesZones } from "../../../../../../common/service.zones.interface";

const zoneSchema = z.object({
  serviceZone: z.string().min(1, "Zone name is required"),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type FormData = z.infer<typeof zoneSchema>;

interface Props {
  editingData: IServicesZones | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const ServiceZoneForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
  const { register, handleSubmit, control, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      serviceZone: "",
      isActive: true,
      isDefault: false,
    }
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    if (editingData) {
      reset({
        serviceZone: editingData.serviceZone || "",
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
        await updateItem("/services-zones", editingData._id, payload);
      } else {
        await createItem("/services-zones", payload);
      }
      onRefresh();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Service Zone" : "Add Service Zone"}
      icon={<Map size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormInput
          label="Zone Name *"
          placeholder="e.g. North Zone, Sector A"
          {...register("serviceZone")}
          error={errors.serviceZone?.message}
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
          label={editingData ? "Update Zone" : "Create"}
          icon={<Save size={20} />}
          loading={isSubmitting}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default ServiceZoneForm;