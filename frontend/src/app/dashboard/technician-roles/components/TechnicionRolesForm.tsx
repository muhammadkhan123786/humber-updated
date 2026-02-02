"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { useFormActions } from "@/hooks/useFormActions";
import { ITechnicianRoles } from "../../../../../../common/ITechnicianRoles.interface";

type TechnicianRoleWithId = ITechnicianRoles & { _id: string };

const roleSchemaValidation = z.object({
  technicianRole: z.string().min(1, "Role name is required."),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type FormData = z.infer<typeof roleSchemaValidation>;

interface Props {
  editingData: TechnicianRoleWithId | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const TechnicianRolesForm = ({ editingData, onClose, themeColor }: Props) => {
  const { createItem, updateItem, isSaving } = useFormActions(
    "/technician-roles",
    "technicianRoles",
    "Technician Role"
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(roleSchemaValidation),
    defaultValues: {
      technicianRole: "",
      isActive: true,
      isDefault: false,
    },
  });

  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    if (editingData) {
      reset({
        technicianRole: editingData.technicianRole,
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
          }
        }
      );
    } else {
      createItem(payload, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Technician Role" : "Add Technician Role"}
      icon={<ShieldCheck size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormInput
          label="Role Name *"
          placeholder="e.g. Senior Mechanic"
          {...register("technicianRole")}
          error={errors.technicianRole?.message}
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
          label={editingData ? "Update Role" : "Create"}
          icon={<Save size={20} />}
          loading={isSaving}
          themeColor={themeColor}
          onCancel={onClose}
        />
      </form>
    </FormModal>
  );
};

export default TechnicianRolesForm;