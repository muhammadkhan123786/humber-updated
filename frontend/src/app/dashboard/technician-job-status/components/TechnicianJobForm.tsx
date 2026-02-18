"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Activity } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { ITechnicianJobStatus } from "../../../../../../common/technician-jobs/ITechnician.activity.status.interface";
import { useFormActions } from "@/hooks/useFormActions";

const statusSchemaValidation = z.object({
    technicianJobStatus: z.string().min(1, "Job status name is required."),
    canChooseTechnician: z.boolean(),
    isActive: z.boolean(),
    isDefault: z.boolean(),
});

type FormData = z.infer<typeof statusSchemaValidation>;

interface Props {
    editingData: (ITechnicianJobStatus & { _id?: string }) | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
}

const TechnicianJobForm = ({ editingData, onClose, themeColor }: Props) => {
    // Hook call
    const { createItem, updateItem, isSaving } = useFormActions(
        "/technician-job-status",
        "technicianJobStatuses",
        "Technician Job Status"
    );

    const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(statusSchemaValidation),
        defaultValues: {
            technicianJobStatus: "",
            canChooseTechnician: false,
            isActive: true,
            isDefault: false,
        },
    });

    const isDefaultValue = useWatch({ control, name: "isDefault" });

    useEffect(() => {
        if (editingData) {
            reset({
                technicianJobStatus: editingData.technicianJobStatus,
                canChooseTechnician: Boolean(editingData.canChooseTechnician),
                isActive: Boolean(editingData.isActive),
                isDefault: Boolean(editingData.isDefault),
            });
        }
    }, [editingData, reset]);

    const onSubmit = async (values: FormData) => {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : {};
        const payload = { ...values, userId: user.id || user._id, isDeleted: false };

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
            title={editingData ? "Edit Job Status" : "Add Job Status"}
            icon={<Activity size={24} />}
            onClose={onClose}
            themeColor={themeColor}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormInput
                    label="Job Status Name *"
                    placeholder="e.g. In Progress, Completed"
                    {...register("technicianJobStatus")}
                    error={errors.technicianJobStatus?.message}
                />

                <Controller
                    control={control}
                    name="canChooseTechnician"
                    render={({ field }) => (
                        <FormToggle
                            label="Technician Select"
                            checked={field.value}
                            onChange={field.onChange}
                        />
                    )}
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
                    label={editingData ? "Update Status" : "Create"}
                    icon={<Save size={20} />}
                    loading={isSaving}
                    themeColor={themeColor}
                    onCancel={onClose}
                />
            </form>
        </FormModal>
    );
};

export default TechnicianJobForm;