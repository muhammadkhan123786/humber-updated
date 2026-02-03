"use client";
import React, { useState } from "react";
import { Calendar, FileText } from "lucide-react";
import { CustomSelect } from "../../../common-form/CustomSelect";

interface Job {
  id: string;
  customer: string;
  email: string;
  model: string;
  ticket: string;
}

const dummyJobs: Job[] = [
  {
    id: "JOB-2024-001",
    customer: "Alice Thompson",
    email: "alice@example.com",
    model: "Pride Go-Go",
    ticket: "TKT-001",
  },
  {
    id: "JOB-2024-002",
    customer: "John Davies",
    email: "john.davies@email.com",
    model: "Invacare Colibri",
    ticket: "TKT-2024-002",
  },
  {
    id: "JOB-2024-003",
    customer: "Robert Wilson",
    email: "robert@webmail.com",
    model: "Sunrise Medical",
    ticket: "TKT-089",
  },
];

const JobSelectionSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const selectedJob = dummyJobs.find((j) => j.id === selectedId) || null;

  const jobOptions = dummyJobs.map((job) => ({
    id: job.id,
    label: `${job.id} - ${job.customer} (${job.ticket})`,
  }));

  return (
    <div className="w-full  mx-auto  font-sans">
      <div className="w-full bg-white rounded-2xl outline-2 -outline-offset-2 outline-green-100 flex flex-col gap-6 p-6 shadow-sm">
        <div className="w-full flex flex-col gap-1">
          <div className="flex items-center gap-2 text-green-600">
            <FileText size={20} strokeWidth={2} />
            <h4 className="leading-none flex items-center gap-2 text-green-600">
              Select Job / Ticket
            </h4>
          </div>
          <p className="text-gray-500 text-base font-normal leading-6 ml-7">
            Select a completed job to automatically load parts and labour
            information
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-indigo-950 text-sm font-normal leading-4 ml-1">
              Job ID *
            </label>
            <CustomSelect
              options={jobOptions}
              value={selectedId}
              onChange={(id: string) => setSelectedId(id)}
              placeholder="Select a job..."
              isSearchable={false}
              className="focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-indigo-950 text-sm font-normal leading-4 ml-1">
              Invoice Number
            </label>
            <div className="h-9 px-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white rounded-[10px]  outline-2 -outline-offset-2 outline-green-100 flex items-center">
              <span className="text-indigo-950 text-sm font-normal">
                INV-2026-1136
              </span>
            </div>
          </div>
        </div>

        {selectedJob && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-full p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl outline-2 -outline-offset-2 outline-blue-100 flex flex-col md:flex-row gap-3">
              <InfoBox label="Customer" value={selectedJob.customer} />
              <InfoBox label="Email" value={selectedJob.email} isMono />
              <InfoBox label="Scooter Model" value={selectedJob.model} />
            </div>
          </div>
        )}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-indigo-950 text-sm font-normal leading-4 ml-1">
              Invoice Date
            </label>
            <div className="relative group">
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full h-9 px-3 bg-gray-100 rounded-[10px] border-2 border-green-100 text-indigo-950 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all cursor-pointer"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-indigo-950 text-sm font-normal leading-4 ml-1">
              Due Date
            </label>
            <div className="relative group">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-9 px-3 bg-gray-100 rounded-[10px] border-2 border-green-100 text-indigo-950 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all cursor-pointer"
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
  <div className="flex-1 px-3 py-3 bg-white/60 rounded-xl flex flex-col gap-1">
    <p className="text-gray-600 text-xs font-normal leading-4">{label}</p>
    <p
      className={`${isMono ? "font-mono text-sm" : "font-bold text-base"} text-gray-900 leading-6`}
    >
      {value}
    </p>
  </div>
);

export default JobSelectionSection;
