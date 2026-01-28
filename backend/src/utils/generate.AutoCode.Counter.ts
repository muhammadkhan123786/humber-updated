import { TicketSequenceCounter } from "../models/ticket-management-system-models/ticket.sequence.models";
import { TechnicianJobSequenceCounter } from "../models/ticket-management-system-models/technician.jobs.counter.models";
import { EmployeeSequenceCounter } from "../models/auto-generate-code-models/technician.employee.code.models";
import { SuplierSequenceCounter } from "../models/auto-generate-code-models/supplier.code.models";
import { CustomerInvoiceSequenceCounter } from "../models/auto-generate-code-models/invoice.code.models";

//generate for db 
export const generateTicketCode = async (): Promise<string> => {
  const year = new Date().getFullYear();

  const counter = await TicketSequenceCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  if (!counter) {
    throw new Error("Failed to generate ticket sequence");
  }
  console.log("counter", counter);
  return `TKT-${year}-${String(counter.seq).padStart(6, "0")}`;
};

export const generateEmployeeCode = async (): Promise<string> => {
  const year = new Date().getFullYear();

  const counter = await EmployeeSequenceCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  if (!counter) {
    throw new Error("Failed to generate ticket sequence");
  }
  console.log("counter", counter);
  return `Employee-${year}-${String(counter.seq).padStart(6, "0")}`;
};

export const generateTechnicianJobCode = async (): Promise<string> => {
  const year = new Date().getFullYear();

  const counter = await TechnicianJobSequenceCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  if (!counter) {
    throw new Error("Failed to Technician Job Code sequence");
  }

  return `JOB-${year}-${String(counter.seq).padStart(6, "0")}`;
};

export const generateSupplierCode = async (): Promise<string> => {
  const year = new Date().getFullYear();

  const counter = await SuplierSequenceCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  if (!counter) {
    throw new Error("Failed to Technician Job Code sequence");
  }

  return `JOB-${year}-${String(counter.seq).padStart(6, "0")}`;
};

export const generateCustomerInvoiceCode = async (): Promise<string> => {
  const year = new Date().getFullYear();

  const counter = await CustomerInvoiceSequenceCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  if (!counter) {
    throw new Error("Failed to Technician Job Code sequence");
  }

  return `INV-${year}-${String(counter.seq).padStart(6, "0")}`;
};


//generate for view

export const getCurrentTechnicianJobCode = async (): Promise<string> => {
  const year = new Date().getFullYear();

  // Just fetch current counter without updating
  const counter = await TechnicianJobSequenceCounter.findOne({ year });

  const seq = counter ? counter.seq + 1 : 1;

  return `JOB-${year}-${String(seq).padStart(6, "0")}`;
};


export const getCurrentTicketCode = async (): Promise<string> => {
  const year = new Date().getFullYear();

  // Just fetch current counter without updating
  const counter = await TicketSequenceCounter.findOne({ year });

  const seq = counter ? counter.seq + 1 : 1;

  return `TKT-${year}-${String(seq).padStart(6, "0")}`;
};


export const getEmployeeCode = async (): Promise<string> => {
  const year = new Date().getFullYear();

  // Just fetch current counter without updating
  const counter = await EmployeeSequenceCounter.findOne({ year });

  const seq = counter ? counter.seq + 1 : 1;

  return `Emp-${year}-${String(seq).padStart(6, "0")}`;
};

export const getSupplierCurrentCode = async (): Promise<string> => {
  const year = new Date().getFullYear();

  // Just fetch current counter without updating
  const counter = await SuplierSequenceCounter.findOne({ year });

  const seq = counter ? counter.seq + 1 : 1;

  return `SUP-${year}-${String(seq).padStart(6, "0")}`;
};


export const getCustomerInvoiceCurrentCode = async (): Promise<string> => {
  const year = new Date().getFullYear();

  // Just fetch current counter without updating
  const counter = await CustomerInvoiceSequenceCounter.findOne({ year });

  const seq = counter ? counter.seq + 1 : 1;

  return `INV-${year}-${String(seq).padStart(6, "0")}`;
};
