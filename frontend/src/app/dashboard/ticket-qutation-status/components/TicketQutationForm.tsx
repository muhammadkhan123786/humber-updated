"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, FileText } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { ITicketQuationStatus } from "../../../../../../common/ticket-quations-interfaces/quation.status.interface";
import { useFormActions } from "@/hooks/useFormActions";

// Schema Validation
const ticketQuotationStatusValidation = z.object({
    ticketQuationStatus: z.string().min(1, "Please enter ticket quotation status name."),
    isActive: z.boolean(),
    isDefault: z.boolean(),
});

type FormData = z.infer<typeof ticketQuotationStatusValidation>;

interface Props {
    editingData: (ITicketQuationStatus & { _id?: string }) | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
}

const TicketQutationForm = ({ editingData, onClose, themeColor }: Props) => {
    const { createItem, updateItem, isSaving } = useFormActions(
        "/ticket-quotation-status",
        "ticketQuotationStatus",
        "Ticket Quotation Status"
    );

    const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(ticketQuotationStatusValidation),
        defaultValues: {
            ticketQuationStatus: "",
            isActive: true,
            isDefault: false,
        },
    });

    const isDefaultValue = useWatch({ control, name: "isDefault" });

    useEffect(() => {
        if (editingData) {
            reset({
                ticketQuationStatus: editingData.ticketQuationStatus,
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
            title={editingData ? "Edit Quotation Status" : "Add Quotation Status"}
            icon={<FileText size={24} />}
            onClose={onClose}
            themeColor={themeColor}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormInput
                    label="Quotation Status Name *"
                    placeholder="e.g. Pending, Approved, Rejected"
                    {...register("ticketQuationStatus")}
                    error={errors.ticketQuationStatus?.message}
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
                    label={editingData ? "Update Status" : "Create Status"}
                    icon={<Save size={20} />}
                    loading={isSaving}
                    themeColor={themeColor}
                    onCancel={onClose}
                />
            </form>
        </FormModal>
    );
};

export default TicketQutationForm;