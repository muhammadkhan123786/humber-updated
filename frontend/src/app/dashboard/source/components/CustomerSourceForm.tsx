"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Share2 } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { createItem, updateItem } from "@/helper/apiHelper";
import { ICustomerSource } from "../../../../../../common/ICustomerSource";

// Validation Schema
const customerSourceSchemaValidation = z.object({
    customerSource: z.string().min(1, "Customer source name is required."),
    isActive: z.boolean(),
    isDefault: z.boolean(),
});

type FormData = z.infer<typeof customerSourceSchemaValidation>;

interface Props {
    editingData: (ICustomerSource & { _id?: string }) | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
}

const CustomerSourceForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(customerSourceSchemaValidation),
        defaultValues: {
            customerSource: "",
            isActive: true,
            isDefault: false,
        },
    });

    // Watch isDefault to handle conditional logic (e.g., forcing isActive if default)
    const isDefaultValue = useWatch({ control, name: "isDefault" });

    useEffect(() => {
        if (editingData) {
            reset({
                customerSource: editingData.customerSource,
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
                await updateItem("/customer-source", editingData._id, payload);
            } else {
                await createItem("/customer-source", payload);
            }
            onRefresh();
            onClose();
        } catch (error: any) {
            alert(error.response?.data?.message || "Error saving customer source");
        }
    };

    return (
        <FormModal
            title={editingData ? "Edit Customer Source" : "Add Customer Source"}
            icon={<Share2 size={24} />}
            onClose={onClose}
            themeColor={themeColor}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormInput
                    label="Source Name *"
                    placeholder="e.g. Google Ads, Referral, Facebook"
                    {...register("customerSource")}
                    error={errors.customerSource?.message}
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
                                // Disable active toggle if it's a default record (must be active)
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
                                    // If set to default, automatically make it active
                                    if (val) setValue("isActive", true);
                                }}
                            />
                        )}
                    />
                </div>

                <FormButton
                    type="submit"
                    label={editingData ? "Update Source" : "Create"}
                    icon={<Save size={20} />}
                    loading={isSubmitting}
                    themeColor={themeColor}
                    onCancel={onClose}
                />
            </form>
        </FormModal>
    );
};

export default CustomerSourceForm;