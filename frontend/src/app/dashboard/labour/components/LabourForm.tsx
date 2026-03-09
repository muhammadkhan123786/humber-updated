"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Wrench } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { ILABOURCOST } from "../../../../../../common/master-interfaces/ILabour.interface";
import { useFormActions } from "@/hooks/useFormActions";

// Schema Validation
const labourSchemaValidation = z.object({
    name: z.string().min(1, "Labour rate name is required."),
    value: z.number().nonnegative("Value must be a positive number."),
    isActive: z.boolean(),
    isDefault: z.boolean(),
});

type FormData = z.infer<typeof labourSchemaValidation>;

interface Props {
    editingData: (ILABOURCOST & { _id?: string }) | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
}

const LabourForm = ({ editingData, onClose, themeColor }: Props) => {
    const { createItem, updateItem, isSaving } = useFormActions(
        "/labour",
        "labour",
        "Labour Rate"
    );

    const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(labourSchemaValidation),
        defaultValues: {
            name: "",
            value: 0,
            isActive: true,
            isDefault: false,
        },
    });

    const isDefaultValue = useWatch({ control, name: "isDefault" });

    useEffect(() => {
        if (editingData) {
            reset({
                name: editingData.name,
                value: editingData.value,
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
            title={editingData ? "Edit Labour Rate" : "Add Labour Rate"}
            icon={<Wrench size={24} />}
            onClose={onClose}
            themeColor={themeColor}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormInput
                    label="Labour Rate Name *"
                    placeholder="e.g. Standard Labour"
                    {...register("name")}
                    error={errors.name?.message}
                />

                <FormInput
                    label="Rate Value *"
                    placeholder="e.g. 50.00"
                    type="number"
                    step="0.01"
                    {...register("value", { valueAsNumber: true })}
                    error={errors.value?.message}
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
                    label={editingData ? "Update Labour Rate" : "Create Labour Rate"}
                    icon={<Save size={20} />}
                    loading={isSaving}
                    themeColor={themeColor}
                    onCancel={onClose}
                />
            </form>
        </FormModal>
    );
};

export default LabourForm;
