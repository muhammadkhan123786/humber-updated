"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Building2 } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { createItem, updateItem } from "@/helper/apiHelper";
import { IDepartments } from "../../../../../../../common/Ticket-management-system/IDepartment.interface";

const departmentSchema = z.object({
    departmentName: z.string().min(1, "Department name is required."),
    isActive: z.boolean(),
    isDefault: z.boolean(),
});

type FormData = z.infer<typeof departmentSchema>;

interface Props {
    editingData: (IDepartments & { _id?: string }) | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
    apiUrl: string;
}

const DepartmentForm = ({ editingData, onClose, onRefresh, themeColor, apiUrl }: Props) => {
    const { register, handleSubmit, reset, control, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(departmentSchema),
        defaultValues: { departmentName: "", isActive: true, isDefault: false },
    });

    const isDefaultValue = useWatch({ control, name: "isDefault" });

    useEffect(() => {
        if (editingData) {
            reset({
                departmentName: editingData.departmentName,
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
                await updateItem(apiUrl, editingData._id, payload);
            } else {
                await createItem(apiUrl, payload);
            }
            onRefresh();
            onClose();
        } catch (error: any) {
            alert(error.response?.data?.message || "Error saving department");
        }
    };

    return (
        <FormModal
            title={editingData ? "Edit Department" : "Add Department"}
            icon={<Building2 size={24} />}
            onClose={onClose}
            themeColor={themeColor}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormInput
                    label="Department Name *"
                    placeholder="e.g. Technical Support"
                    {...register("departmentName")}
                    error={errors.departmentName?.message}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Controller
                        control={control}
                        name="isActive"
                        render={({ field }) => (
                            <FormToggle label="Active" checked={field.value} onChange={field.onChange} disabled={isDefaultValue} />
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
                    label={editingData ? "Update Department" : "Create"}
                    icon={<Save size={20} />}
                    loading={isSubmitting}
                    themeColor={themeColor}
                    onCancel={onClose}
                />
            </form>
        </FormModal>
    );
};

export default DepartmentForm;