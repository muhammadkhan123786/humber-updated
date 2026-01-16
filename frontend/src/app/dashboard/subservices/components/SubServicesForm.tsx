"use client";
import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Layers } from "lucide-react";
import { z } from "zod";
import axios from "axios";
import { ISubServicesInterface } from "../../../../../../common/ISubServices.interface"; // Adjust path
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const subServiceSchema = z.object({
    masterServiceId: z.string().min(1, "Master service is required."),
    subServiceName: z.string().min(1, "Sub-service name is required."),
    cost: z.number().nonnegative("Cost must be 0 or more."),
    notes: z.string().optional(),
    isActive: z.boolean(),
    isDefault: z.boolean(),
});

// Use the interface for the form data
type FormFields = z.infer<typeof subServiceSchema>;

interface Props {
    editingData: ISubServicesInterface | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
    apiUrl: string;
}

const SubServicesForm = ({ editingData, onClose, onRefresh, themeColor, apiUrl }: Props) => {
    const [masterServices, setMasterServices] = useState<any[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(subServiceSchema),
        defaultValues: {
            masterServiceId: "",
            subServiceName: "",
            cost: 0,
            notes: "",
            isActive: true,
            isDefault: false,
        },
    });

    const isDefaultValue = useWatch({ control, name: "isDefault" });

    useEffect(() => {
        const fetchMaster = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${BASE_URL}/service-types-master`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { isActive: true, isDeleted: false }
                });
                setMasterServices(res.data.data || []);
            } catch (err) {
                console.error("Master fetch error", err);
            }
        };
        fetchMaster();

        if (editingData) {
            reset({
                masterServiceId: typeof editingData.masterServiceId === 'object' 
                    ? (editingData.masterServiceId as any)._id 
                    : editingData.masterServiceId,
                subServiceName: editingData.subServiceName,
                cost: editingData.cost || 0,
                notes: editingData.notes || "",
                isActive: Boolean(editingData.isActive),
                isDefault: Boolean(editingData.isDefault),
            });
        }
    }, [editingData, reset]);

    const onSubmit = async (values: FormFields) => {
        try {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : {};
            const payload = { ...values, userId: user.id || user._id };

            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (editingData?._id) {
                await axios.put(`${apiUrl}/${editingData._id}`, payload, config);
            } else {
                await axios.post(apiUrl, payload, config);
            }
            onRefresh();
            onClose();
        } catch (error: any) {
            alert(error.response?.data?.message || "Error saving data");
        }
    };

    return (
        <FormModal
            title={editingData ? "Edit Sub-Service" : "Add Sub-Service"}
            icon={<Layers size={24} />}
            onClose={onClose}
            themeColor={themeColor}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Master Service Type *</label>
                        <select
                            {...register("masterServiceId")}
                            className={`w-full border rounded-xl p-3 outline-none focus:ring-2 transition-all ${errors.masterServiceId ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'}`}
                        >
                            <option value="">Select a Category</option>
                            {masterServices.map((m: any) => (
                                <option key={m._id} value={m._id}>{m.MasterServiceType}</option>
                            ))}
                        </select>
                        {errors.masterServiceId && <p className="text-red-500 text-xs mt-1">{errors.masterServiceId.message}</p>}
                    </div>

                    <FormInput
                        label="Sub-Service Name *"
                        placeholder="e.g. Standard Cleaning"
                        {...register("subServiceName")}
                        error={errors.subServiceName?.message}
                    />

                    <FormInput
                        label="Estimated Cost"
                        type="number"
                        placeholder="0.00"
                        {...register("cost", { valueAsNumber: true })}
                        error={errors.cost?.message}
                    />

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Notes / Details</label>
                        <textarea
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200 h-24 resize-none"
                            {...register("notes")}
                        />
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
                    label={editingData ? "Update Sub-Service" : "Create Sub-Service"}
                    icon={<Save size={20} />}
                    loading={isSubmitting}
                    themeColor={themeColor}
                    onCancel={onClose}
                />
            </form>
        </FormModal>
    );
};
export default SubServicesForm;