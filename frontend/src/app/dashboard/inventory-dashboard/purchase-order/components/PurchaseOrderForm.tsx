// src/components/PurchaseOrderForm.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { FileUpload } from "@/components/form/FileUpload";
import { Link, Truck, Users, Hash, Calendar } from "lucide-react";

// Define form data types
interface PurchaseOrderFormData {
  purchaseOrder: string;
  supplier: string;
  carrier: string;
  trackingNumber: string;
  expectedDate: string;
  attachments: File[];
}

export default function PurchaseOrderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PurchaseOrderFormData>({
    defaultValues: {
      purchaseOrder: "PO-8862-Dec",
      supplier: "Beizch Automotive",
      carrier: "",
      trackingNumber: "0295567890",
      expectedDate: "Dec 13,2025",
      attachments: [],
    },
  });

  // Watch form values
  const formValues = watch();

  const onSubmit: SubmitHandler<PurchaseOrderFormData> = (data) => {
    console.log("Form submitted:", data);
    // Add your form submission logic here
    alert("Form submitted successfully!");
  };

  const handleFilesChange = (files: File[]) => {
    setValue("attachments", files);
  };

  return (
    <div className="p-8 bg-bg">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Purchase Order Details (8 columns) */}
            <div className="col-span-12 lg:col-span-8 bg-card rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-fg mb-6">
                Purchase Order Details
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Link Purchase Order"
                    icon={Link}
                    placeholder="PO-8862-Dec"
                    success
                    {...register("purchaseOrder", {
                      required: "Purchase Order is required",
                    })}
                    error={errors.purchaseOrder?.message}
                  />

                  <FormInput
                    label="Supplier"
                    icon={Users}
                    value={formValues.supplier}
                    placeholder="Beizch Automotive"
                    disabled
                    {...register("supplier", {
                      required: "Supplier is required",
                    })}
                    error={errors.supplier?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Carrier"
                    icon={Truck}
                    placeholder="Enter carrier name"
                    {...register("carrier", {
                      required: "Carrier is required",
                    })}
                    error={errors.carrier?.message}
                  />

                  <FormInput
                    label="Tracking #"
                    icon={Hash}
                    value={formValues.trackingNumber}
                    placeholder="0295567890"
                    disabled
                    {...register("trackingNumber", {
                      required: "Tracking number is required",
                    })}
                    error={errors.trackingNumber?.message}
                  />
                </div>

                <FormInput
                  label="Expected Date"
                  icon={Calendar}
                  type="text"
                  value={formValues.expectedDate}
                  placeholder="Dec 13,2025"
                  disabled
                  {...register("expectedDate", {
                    required: "Expected date is required",
                  })}
                  error={errors.expectedDate?.message}
                />
              </div>
            </div>

            {/* Right Column - Attachments (4 columns) */}
            <div className="col-span-12 lg:col-span-4 bg-card rounded-2xl border border-border p-6">
              <FileUpload
                label="Attachments"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                maxSize={5}
                onFilesChange={handleFilesChange}
                helperText="Packing slip damaged goods proves (max 5MB)"
                {...register("attachments")}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
