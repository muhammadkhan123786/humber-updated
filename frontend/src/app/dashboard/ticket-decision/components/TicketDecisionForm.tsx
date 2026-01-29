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


    const selectedColor = useWatch({ control, name: "color" });
    
    // Helper to generate gradient
    const getGradient = (hex: string) => {
        if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) return hex;
        // Simple darken logic for gradient
        const adjust = (color: string, amount: number) => {
            return '#' + color.replace(/^#/, '').replace(/../g, c => ('0'+Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)).substr(-2));
        }
        return `linear-gradient(135deg, ${hex}, ${adjust(hex, -40)})`;
    };

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
                    <label className="text-sm font-semibold text-gray-700">Color Gradient *</label>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-3">
                        <div className="flex gap-3 items-center">
                             {/* Color Picker */}
                             <div className="relative w-14 h-14 overflow-hidden rounded-xl border-2 border-white shadow-md ring-1 ring-gray-200 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                                 <input
                                     type="color"
                                     className="absolute -top-4 -left-4 w-24 h-24 p-0 border-0 cursor-pointer"
                                     {...register("color")}
                                 />
                             </div>
                            
                             {/* Hex Input */}
                            <div className="flex-1">
                                 <input 
                                     type="text" 
                                     className={`w-full px-4 py-3 rounded-xl bg-white border outline-none transition-all text-gray-700 font-mono ${errors.color ? 'border-red-500 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400'}`}
                                     placeholder="#000000"
                                     {...register("color")}
                                />
                                 {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color.message}</p>}
                            </div>

                            {/* Preview Section */}
                            <div 
                                className="h-12 w-24 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-[10px] text-white font-bold tracking-wide uppercase"
                                style={{ background: getGradient(selectedColor) }}
                            >
                                Preview
                            </div>
                        </div>

                        {/* Generated Code Display */}
                        <div className="text-xs text-gray-400 font-mono bg-white px-3 py-2 rounded-lg border border-gray-100 truncate">
                            {getGradient(selectedColor)}
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
