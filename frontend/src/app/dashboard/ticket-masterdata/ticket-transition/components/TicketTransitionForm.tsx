"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GitCompare, Loader2, Save } from "lucide-react";
import { z } from "zod";

import { FormModal } from "@/app/common-form/FormModal";
import { FormInput } from "@/app/common-form/FormInput";
import { FormSelect } from "@/app/common-form/FormSelect";
import { FormButton } from "@/app/common-form/FormButton";
import { FormToggle } from "@/app/common-form/FormToggle";

import {
  createItem,
  updateItem,
  getAll,
} from "../../../../../helper/apiHelper";
import { ITicketStatus } from "../../../../../../../common/Ticket-management-system/ITicketStatus.interface";
import { ITicketActions } from "../../../../../../../common/Ticket-management-system/ITicketActions.interface";
import { ITicketType } from "../../../../../../../common/Ticket-management-system/ITicketType.interface";
import { ITicketStatusTransitions } from "../../../../../../../common/Ticket-management-system/ITicket.status.transition.interface";

const transitionSchema = z.object({
  from_status_id: z.string().min(1, "Required"),
  to_status_id: z.string().min(1, "Required"),
  action_id: z.string().min(1, "Required"),
  ticket_type_id: z.string().min(1, "Required"),
  description: z.string().optional(),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type TransitionFormData = z.infer<typeof transitionSchema>;

type EditTransitionData = ITicketStatusTransitions<
  string,
  string | { _id: string },
  string | { _id: string },
  string | { _id: string },
  string | { _id: string }
> & { _id?: string; isActive?: boolean; isDefault?: boolean };

interface Props {
  editingData: EditTransitionData | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const TicketTransitionForm = ({
  editingData,
  onClose,
  onRefresh,
  themeColor,
}: Props) => {
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [options, setOptions] = useState<{
    statuses: (ITicketStatus & { _id: string; is_Terminal?: boolean })[];
    actions: (ITicketActions & { _id: string })[];
    types: (ITicketType & { _id: string })[];
  }>({
    statuses: [],
    actions: [],
    types: [],
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransitionFormData>({
    resolver: zodResolver(transitionSchema),
    defaultValues: {
      from_status_id: "",
      to_status_id: "",
      action_id: "",
      ticket_type_id: "",
      description: "",
      isActive: true,
      isDefault: false,
    },
  });

  // Watch isDefault to disable isActive toggle
  const isDefaultValue = useWatch({ control, name: "isDefault" });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        const [s, a, t] = await Promise.all([
          getAll<ITicketStatus & { _id: string; is_Terminal?: boolean }>(
            "/ticket-status?filter=all",
            { limit: 100 }
          ),
          getAll<ITicketActions & { _id: string }>("/ticket-actions?filter=all", {
            limit: 100,
          }),
          getAll<ITicketType & { _id: string }>("/ticket-types?filter=all", {
            limit: 100,
          }),
        ]);
        setOptions({ statuses: s.data, actions: a.data, types: t.data });
      } catch (error) {
        console.error("Failed to load transition options:", error);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (!loadingOptions && editingData) {
      const getID = (field: any) => (field?._id ? field._id : field || "");
      reset({
        from_status_id: getID(editingData.from_status_id),
        to_status_id: getID(editingData.to_status_id),
        action_id: getID(editingData.action_id),
        ticket_type_id: getID(editingData.ticket_type_id),
        description: editingData.description || "",
        isActive: editingData.isActive ?? true,
        isDefault: editingData.isDefault ?? false,
      });
    }
  }, [editingData, reset, loadingOptions]);

  const onSubmit = async (values: TransitionFormData) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      const payload = { ...values, userId: user.id || user._id };

      if (editingData?._id) {
        await updateItem("/ticket-transition-setup", editingData._id, payload);
      } else {
        await createItem("/ticket-transition-setup", payload);
      }
      onRefresh();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error saving transition");
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Transition" : "New Transition"}
      icon={<GitCompare size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        {loadingOptions ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-sm">Loading workflow options...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label="Ticket Type"
                options={options.types
                  .filter((t) => t.isActive)
                  .map((t) => ({ label: t.code || t.label, value: t._id }))}
                error={errors.ticket_type_id?.message}
                {...register("ticket_type_id")}
              />

              <FormSelect
                label="Trigger Action"
                options={options.actions
                  .filter((a) => a.isActive === true)
                  .map((a) => ({
                    label: a.code,
                    value: a._id,
                  }))}
                error={errors.action_id?.message}
                {...register("action_id")}
              />

              <FormSelect
                label="From Status"
                options={options.statuses
                  .filter((s) => s.isActive)
                  .map((s) => ({
                    label: s.is_Terminal ? `${s.code} (Terminal)` : s.code,
                    value: s._id,
                  }))}
                error={errors.from_status_id?.message}
                {...register("from_status_id")}
              />

              <FormSelect
                label="To Status"
                options={options.statuses
                  .filter((s) => s.isActive)
                  .map((s) => ({
                    label: s.is_Terminal ? `${s.code} (Terminal)` : s.code,
                    value: s._id,
                  }))}
                error={errors.to_status_id?.message}
                {...register("to_status_id")}
              />
            </div>

            <FormInput
              label="Description"
              placeholder="Explain why this transition exists..."
              {...register("description")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <FormToggle
                    label="Active"
                    checked={field.value}
                    onChange={field.onChange}
                    // Locked if default
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
                      if (val) {
                        setValue("isActive", true);
                      }
                    }}
                  />
                )}
              />
            </div>

            <FormButton
              type="submit"
              label={
                editingData
                  ? "Update Transition Rule"
                  : "Create"
              }
              icon={<Save size={20} />}
              loading={isSubmitting}
              themeColor={themeColor}
              onCancel={onClose}
            />
          </>
        )}
      </form>
    </FormModal>
  );
};

export default TicketTransitionForm;
