import { IBaseEntity } from "../Base.Interface";

export type PAYMENTMETHOD = "CASH" | "BANK TRANSFER" | "CARD PAYMENT" | "ONLINE PAYMENT" | "QR CODE" | "PENDING"
export type InvoiceService<TACTIVITYID = string> = {
    activityId: TACTIVITYID;
    duration: string; // HH:mm or ISO duration
    description: string;
    additionalNotes?: string;
    source?: "JOB" | "INVOICE";
};

export type InvoicePart<TPRODUCTID = string> = {
    productId: TPRODUCTID;
    oldPartConditionDescription?: string;
    newSerialNumber?: string;
    quantity: number;
    unitCost: number;
    totalCost?: number;
    reasonForChange?: string;
    source?: "JOB" | "INVOICE";
};

export interface IINVOICEONJOBID<
    TUserId = string,
    TJOBID = string,
    TCUSTOMERID = string,
    TDUEDATE = string,
    TDATE = string
> extends IBaseEntity<TUserId> {
    invoiceId: string;
    jobId: TJOBID;
    customerId: TCUSTOMERID;
    services: InvoiceService[];
    parts: InvoicePart[];
    completionSummary?: string;
    invoiceDate?: TDATE;
    dueDate?: TDUEDATE;
    callOutFee?: number;
    discountType: "Percentage" | "Fix Amount";
    isVATEXEMPT?: boolean;
    partsTotal?: number;
    labourTotal?: number;
    subTotal?: number;
    discountAmount?: number;
    netTotal?: number;
    invoiceNotes?: string;
    termsAndConditions?: string;
    paymentLink?: string;
    paymentStatus?: "PENDING" | "PAID";
    status?: "DRAFT" | "ISSUED" | "CANCELLED" | "PAID";
}
