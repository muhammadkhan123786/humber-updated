import { Schema, Types } from "mongoose";
import { commonSchema } from "../shared/common.schema";

export const InvoiceServiceSchema = new Schema(
  {
    activityId: {
      type: Types.ObjectId,
      required: true,
      ref: "TechnicianServiceType",
    },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    additionalNotes: { type: String },
    source: {
      type: String,
      enum: ["JOB", "INVOICE"],
      required: true,
    },
    ...commonSchema,
  },
  { _id: false },
);

export const InvoicePartSchema = new Schema(
  {
    partId: { type: Types.ObjectId, ref: "Parts", required: true },
    oldPartConditionDescription: { type: String },
    newSerialNumber: { type: String },
    quantity: { type: Number, required: true },
    unitCost: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    reasonForChange: { type: String },
    source: {
      type: String,
      enum: ["JOB", "INVOICE"],
      required: true,
    },
    ...commonSchema,
  },
  { _id: false },
);

export const CutomerInvoiceSchema = {
  invoiceId: {
    type: String,
    required: true,
    unique: true,
  },
  jobId: {
    type: Types.ObjectId,
    ref: "TechniciansJobs",
    required: true,
  },
  customerId: {
    type: Types.ObjectId,
    ref: "CustomerBase",
    required: true,
  },
  services: { type: [InvoiceServiceSchema], default: [] },
  parts: { type: [InvoicePartSchema], default: [] },
  completionSummary: { type: String },
  invoiceDate: { type: Date },
  dueDate: { type: Date },
  callOutFee: { type: Number, default: 0 },
  generalNotes: { type: String },
  discountType: {
    type: String,
    enum: ["Percentage", "Fix Amount"],
    default: "Percentage",
  } as const,
  isVATEXEMPT: { type: Boolean, default: false },
  partsTotal: { type: Number, default: 0 },
  labourTotal: { type: Number, default: 0 },
  subTotal: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  netTotal: { type: Number, default: 0 },
  invoiceNotes: { type: String },
  termsAndConditions: { type: String },
  paymentLink: { type: String },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID"],
    default: "PENDING",
  } as const,
  status: {
    type: String,
    enum: ["DRAFT", "ISSUED", "CANCELLED", "PAID"],
    default: "DRAFT",
  } as const,
  taxAmount: { type: Number, default: 0 },
  paymentMethod: {
    type: String,
    enum: [
      "CASH",
      "BANK TRANSFER",
      "CARD PAYMENT",
      "ONLINE PAYMENT",
      "QR CODE",
      "PENDING",
    ],
    default: "PENDING",
  },
  ...commonSchema,
};
