"use client";
import React, { useState, useMemo } from "react";
import { Calendar, FileText } from "lucide-react";
import { CustomSelect } from "../../../common-form/CustomSelect";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormData } from "../../../../schema/invoice.schema";

interface JobSelectionSectionProps {
  jobs: any[];
  onJobSelect: (jobId: string) => void;
  selectedJob: any | null;
  form: UseFormReturn<InvoiceFormData>;
  invoiceCode?: string; // Add this prop
}

const JobSelectionSection: React.FC<JobSelectionSectionProps> = ({
  jobs,
  onJobSelect,
  selectedJob,
  form,
  invoiceCode,
}) => {
  const [selectedId, setSelectedId] = useState<string>("");

  // Watch directly from form
  const invoiceDateValue = form.watch("invoiceDate");
  const dueDateValue = form.watch("dueDate");

  const formattedInvoiceDate = invoiceDateValue
    ? new Date(invoiceDateValue).toISOString().split("T")[0]
    : "";

  const formattedDueDate = dueDateValue
    ? new Date(dueDateValue).toISOString().split("T")[0]
    : "";

  const handleJobChange = (id: string) => {
    setSelectedId(id);
    onJobSelect(id);
  };

  const handleInvoiceDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("invoiceDate", new Date(e.target.value), {
      shouldValidate: true,
    });
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("dueDate", new Date(e.target.value), {
      shouldValidate: true,
    });
  };

  // Memoized job options
  const jobOptions = useMemo(
    () =>
      jobs.map((job) => ({
        id: job._id,
        label: `${job.jobId || job._id} - ${
          job.ticketId?.customerId?.personId?.firstName ||
          job.ticketId?.customerId?.name ||
          "Customer"
        } (${job.ticketId?.ticketCode || "No Ticket"})`,
      })),
    [jobs],
  );

  const customerName = selectedJob?.ticketId?.customerId?.personId
    ? `${selectedJob.ticketId.customerId.personId.firstName || ""} ${
        selectedJob.ticketId.customerId.personId.lastName || ""
      }`.trim()
    : selectedJob?.customerName || "N/A";

  const customerEmail =
    selectedJob?.ticketId?.customerId?.contactId?.emailId || "N/A";

  const vehicleModel =
    selectedJob?.ticketId?.vehicleId?.productName ||
    selectedJob?.ticketId?.vehicleId?.modelId?.modelName ||
    "N/A";

  // Get the invoice ID from form or use the auto-generated code
  const displayInvoiceId =
    form.watch("invoiceId") || invoiceCode || "Will be auto-generated";

  return (
    <div className="w-full mx-auto font-sans">
      <div className="w-full bg-white rounded-2xl outline-2 -outline-offset-2 outline-green-100 flex flex-col gap-6 p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-green-600">
            <FileText size={20} />
            <h4 className="text-green-600">Select Job / Ticket</h4>
          </div>
          <p className="text-gray-500 ml-7">
            Select a completed job to automatically load parts and labour
            information
          </p>
        </div>

        {/* Job + Invoice Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm ml-1">Job ID *</label>
            <CustomSelect
              options={jobOptions}
              value={selectedId}
              onChange={handleJobChange}
              placeholder="Select a job..."
              isSearchable
            />
          </div>

          <div>
            <label className="text-sm ml-1">Invoice Number</label>
            <div className="h-9 px-3 rounded-[10px] outline-2 outline-green-100 flex items-center bg-gray-50">
              <span className="text-sm font-medium text-indigo-950">
                {displayInvoiceId}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Job Info */}
        {selectedJob && (
          <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl outline outline-blue-100 flex flex-col md:flex-row gap-3">
            <InfoBox label="Customer" value={customerName} />
            <InfoBox label="Email" value={customerEmail} isMono />
            <InfoBox label="Scooter Model" value={vehicleModel} />
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm ml-1">Invoice Date</label>
            <div className="relative">
              <input
                type="date"
                value={formattedInvoiceDate}
                onChange={handleInvoiceDateChange}
                className="w-full h-9 px-3 bg-gray-100 rounded-[10px] border-2 border-green-100 text-sm"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm ml-1">Due Date</label>
            <div className="relative">
              <input
                type="date"
                value={formattedDueDate}
                onChange={handleDueDateChange}
                className="w-full h-9 px-3 bg-gray-100 rounded-[10px] border-2 border-green-100 text-sm"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox: React.FC<{ label: string; value: string; isMono?: boolean }> = ({
  label,
  value,
  isMono,
}) => (
  <div className="flex-1 px-3 py-3 bg-white/60 rounded-xl">
    <p className="text-xs text-gray-600">{label}</p>
    <p className={`${isMono ? "font-mono text-sm" : "font-bold text-base"}`}>
      {value || "N/A"}
    </p>
  </div>
);

export default JobSelectionSection;
