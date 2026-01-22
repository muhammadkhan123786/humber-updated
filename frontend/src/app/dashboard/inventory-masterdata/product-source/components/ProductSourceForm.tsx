"use client";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Database } from "lucide-react";
import { z } from "zod";
import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormToggle } from "@/app/common-form/FormToggle";
import { FormButton } from "@/app/common-form/FormButton";
import { createItem, updateItem } from "@/helper/apiHelper";
import { IProductSource } from "../../../../../../../common/IProduct.source.interface";

const productSourceSchemaValidation = z.object({
    productSource: z.string().min(1, "Product source name is required."),
    isActive: z.boolean(),
    isDefault: z.boolean(),
});

type FormData = z.infer<typeof productSourceSchemaValidation>;

interface Props {
    editingData: (IProductSource & { _id?: string }) | null;
    onClose: () => void;
    onRefresh: () => void;
    themeColor: string;
    apiUrl: string;
}

const ProductSourceForm = ({ editingData, onClose, onRefresh, themeColor, apiUrl }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(productSourceSchemaValidation),
        defaultValues: {
            productSource: "",
            isActive: true,
            isDefault: false,
        },
    });

    const isDefaultValue = useWatch({ control, name: "isDefault" });

    useEffect(() => {
        if (editingData) {
            reset({
                productSource: editingData.productSource,
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
                await updateItem(apiUrl, editingData._id, payload);
            } else {
                await createItem(apiUrl, payload);
            }
            onRefresh();
            onClose();
        } catch (error: any) {
            alert(error.response?.data?.message || "Error saving data");
        }
    };

    return (
        <FormModal
            title={editingData ? "Edit Product Source" : "Add Product Source"}
            icon={<Database size={24} />}
            onClose={onClose}
            themeColor={themeColor}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormInput
                    label="Product Source Name *"
                    placeholder="e.g. Warehouse, Supplier A"
                    {...register("productSource")}
                    error={errors.productSource?.message}
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

export default ProductSourceForm;