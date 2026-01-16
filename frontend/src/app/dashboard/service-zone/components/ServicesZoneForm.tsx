"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { Save, Map } from "lucide-react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";

interface Props {
    editingData: any | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
    apiUrl: string;
}

const ServiceZoneForm = ({ editingData, onClose, onRefresh, themeColor, apiUrl }: Props) => {
    const { register, handleSubmit, control, reset, setValue, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            serviceZone: "",
            isActive: true,
            isDefault: false,
        }
    });

    const isDefaultValue = useWatch({ control, name: "isDefault" });

    useEffect(() => {
        if (editingData) {
            reset({
                serviceZone: editingData.serviceZone || "",
                isActive: editingData.isActive,
                isDefault: editingData.isDefault,
            });
        }
    }, [editingData, reset]);

    const onSubmit = async (values: any) => {
        try {
            const token = localStorage.getItem("token");
            const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const payload = { ...values, userId: savedUser.id || savedUser._id };

            if (editingData) {
                await axios.put(`${apiUrl}/${editingData._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(apiUrl, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            onRefresh();
            onClose();
        } catch (err: any) {
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    return (
        <FormModal
            title={editingData ? "Edit Service Zone" : "Add Service Zone"}
            icon={<Map size={24} />}
            onClose={onClose}
            themeColor={themeColor}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormInput
                    label="Zone Name *"
                    placeholder="e.g. North Zone, Sector A"
                    {...register("serviceZone", { required: "Zone name is required" })}
                    error={errors.serviceZone?.message as string}
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
                    label={editingData ? "Update Zone" : "Create"}
                    icon={<Save size={20} />}
                    loading={isSubmitting}
                    themeColor={themeColor}
                    onCancel={onClose}
                />
            </form>
        </FormModal>
    );
};

export default ServiceZoneForm;