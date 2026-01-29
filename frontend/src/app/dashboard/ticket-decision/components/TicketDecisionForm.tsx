"use client";
import React, { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Gavel } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { IDecision } from "../../../../../../common/master-interfaces/IDecision.interface";
import { useFormActions } from "@/hooks/useFormActions";

const ticketDecisionSchemaValidation = z.object({
    decision: z.string().min(1, "Decision name is required"),
    description: z.string().min(1, "Please add a description."),
    color: z.string().min(1, "Please enter color code."),
    isActive: z.boolean(),
    isDefault: z.boolean(),
});

type FormData = z.infer<typeof ticketDecisionSchemaValidation>;

interface Props {
    editingData: (IDecision & { _id?: string }) | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
}

const TicketDecisionForm = ({ editingData, onClose, themeColor }: Props) => {
    const { createItem, updateItem, isSaving } = useFormActions(
        "/ticket-decision",
        "ticketDecisions",
        "Ticket Decision"
    );

    const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(ticketDecisionSchemaValidation),
        defaultValues: {
            decision: "",
            description: "",
            color: "#000000",
            isActive: true,
            isDefault: false,
        },
    });

    const isDefaultValue = useWatch({ control, name: "isDefault" });

    useEffect(() => {
        if (editingData) {
            reset({
                decision: editingData.decision,
                description: editingData.description,
                color: editingData.color,
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
                { onSuccess: onClose }
            );
        } else {
            createItem(payload, { onSuccess: onClose });
        }
    };

    return (
        <FormModal
            title={editingData ? "Edit Ticket Decision" : "Add Ticket Decision"}
            icon={<Gavel size={24} />}
            onClose={onClose}
            themeColor={themeColor}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormInput
                    label="Decision Name *"
                    placeholder="e.g. Approve"
                    {...register("decision")}
                    error={errors.decision?.message}
                />
                
                <FormInput
                    label="Description *"
                    placeholder="Decision description"
                    {...register("description")}
                    error={errors.description?.message}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Color Code *</label>
                    <div className="flex gap-2">
                         <div className="relative w-12 h-full overflow-hidden rounded-lg border border-gray-200">
                             <input
                                 type="color"
                                 className="absolute -top-2 -left-2 w-20 h-20 p-0 border-0 cursor-pointer"
                                 {...register("color")}
                             />
                         </div>
                        <div className="flex-1">
                             <input 
                                 type="text" 
                                 className={`w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none transition-all text-gray-700 ${errors.color ? 'border-red-500 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400'}`}
                                 placeholder="#000000"
                                 {...register("color")}
                            />
                             {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color.message}</p>}
                        </div>
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
                    label={editingData ? "Update Decision" : "Create"}
                    icon={<Save size={20} />}
                    loading={isSaving}
                    themeColor={themeColor}
                    onCancel={onClose}
                />
            </form>
        </FormModal>
    );
};

export default TicketDecisionForm;
