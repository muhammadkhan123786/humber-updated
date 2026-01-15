"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Settings2 } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { createItem, updateItem } from "@/helper/apiHelper";

const schema = z.object({
    serviceRequestType: z.string().min(1, "Request type name is required."),
    isActive: z.boolean(),
    isDefault: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
    editingData: any;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
}

const ServiceRequestForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
    const { register, handleSubmit, reset, control, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { serviceRequestType: "", isActive: true, isDefault: false },
    });

    const isDefaultValue = useWatch({ control, name: "isDefault" });

    useEffect(() => {
        if (editingData) {
            reset({
                serviceRequestType: editingData.serviceRequestType,
                isActive: Boolean(editingData.isActive),
                isDefault: Boolean(editingData.isDefault),
            });
        }
    }, [editingData, reset]);

    const onSubmit = async (values: FormData) => {
        try {
            if (editingData?._id) {
                await updateItem("/service-request-type", editingData._id, values);
            } else {
                await createItem("/service-request-type", values);
            }
            onRefresh();
            onClose();
        } catch (error: any) {
            alert(error.response?.data?.message || "Error saving data");
        }
    };

    return (
        <FormModal title={editingData ? "Edit Request Type" : "Add Request Type"} icon={<Settings2 size={24} />} onClose={onClose} themeColor={themeColor}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormInput label="Request Type Name *" placeholder="e.g. Technical Support" {...register("serviceRequestType")} error={errors.serviceRequestType?.message} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Controller control={control} name="isActive" render={({ field }) => (
                        <FormToggle label="Active" checked={field.value} onChange={field.onChange} disabled={isDefaultValue} />
                    )} />
                    <Controller control={control} name="isDefault" render={({ field }) => (
                        <FormToggle label="Default" checked={field.value} onChange={(val) => { field.onChange(val); if (val) setValue("isActive", true); }} />
                    )} />
                </div>
                <FormButton type="submit" label={editingData ? "Update Type" : "Create"} icon={<Save size={20} />} loading={isSubmitting} themeColor={themeColor} onCancel={onClose} />
            </form>
        </FormModal>
    );
};

export default ServiceRequestForm;