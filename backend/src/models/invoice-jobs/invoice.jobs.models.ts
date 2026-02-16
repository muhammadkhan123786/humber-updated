import { Document, Model, model, Schema, Types } from "mongoose";

import { IINVOICEONJOBID } from "../../../../common/invoice-interfaces/invoice.interface";

import { CutomerInvoiceSchema } from "../../schemas/job-invoice-schemas/job.invoice.schema";
export type customerInvoiceDoc = IINVOICEONJOBID<
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId,
    Date,
    Date
> &
    Document;
const customerInvoiceSchema = new Schema<customerInvoiceDoc>(
    {
        ...CutomerInvoiceSchema,
    },
    { timestamps: true },
);
export const CustomerJobsInvoices: Model<customerInvoiceDoc> = model<customerInvoiceDoc>(
    "CustomerJobsInvoices",
    customerInvoiceSchema,
);
