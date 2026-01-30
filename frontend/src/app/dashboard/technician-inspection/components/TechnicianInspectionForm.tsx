"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, ClipboardCheck } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { ITechnicianInspectionList } from "../../../../../../common/master-interfaces/ITechnician.inspection.list.interface";
import { useFormActions } from "@/hooks/useFormActions";

// Inside TechnicianInspectionForm.tsx
const inspectionSchemaValidation = z.object({
    technicianInspection: z.string().min(1, "Inspection name is required."),
    technicianInspectionDescription: z.string().optional(), // Add this
    isActive: z.boolean(),
    isDefault: z.boolean(),
});

type FormData = z.infer<typeof inspectionSchemaValidation>;

interface Props {
    editingData: (ITechnicianInspectionList & { _id?: string }) | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
}

const TechnicianInspectionForm = ({ editingData, onClose, themeColor }: Props) => {
    // Hook call
    const { createItem, updateItem, isSaving } = useFormActions(
        "/technician-inspection",
        "technicianInspections",
        "Technician Inspection"
    );

    const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(inspectionSchemaValidation),
        defaultValues: {
            technicianInspection: "",
            isActive: true,
            isDefault: false,
        },
    });

    const isDefaultValue = useWatch({ control, name: "isDefault" });

    useEffect(() => {
        if (editingData) {
            reset({
                technicianInspection: editingData.technicianInspection,
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
            technicianInspectionDescription: values.technicianInspectionDescription || ""
        };

        if (editingData?._id) {
            // Update Mutation
            updateItem(
                { id: editingData._id, payload },
                {
                    onSuccess: () => {
                        onClose();
                    }
                }
            );
        } else {
            // Create Mutation
            createItem(payload, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    return (
        <FormModal
            title={editingData ? "Edit Inspection Item" : "Add Inspection Item"}
            icon={<ClipboardCheck size={24} />}
            onClose={onClose}
            themeColor={themeColor}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormInput
                    label="Inspection Name *"
                    placeholder="e.g. Engine Oil Check"
                    {...register("technicianInspection")}
                    error={errors.technicianInspection?.message}
                />
                <FormInput
                    label="Description"
                    placeholder="e.g. Check for leaks or cracks"
                    {...register("technicianInspectionDescription")}
                    error={errors.technicianInspectionDescription?.message}
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
                    label={editingData ? "Update Inspection" : "Create"}
                    icon={<Save size={20} />}
                    loading={isSaving}
                    themeColor={themeColor}
                    onCancel={onClose}
                />
            </form>
        </FormModal>
    );
};

export default TechnicianInspectionForm;