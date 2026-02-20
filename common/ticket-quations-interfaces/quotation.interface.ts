import { IBaseEntity } from '../Base.Interface';
export type QuotationStatuses = "SENT TO ADMIN" | "DRAFTED" | "SEND TO CUSTOMER" | "SEND TO INSURANCE" | "APPROVED" | "REJECTED";
export interface IQuotationPartItem {
    partId: string;
    partName: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    total: number;
}

export interface ITicketQuotation<TUserId = string, TTICKETID = string, TPARTS = IQuotationPartItem[], TTTECHNICIANID = string, VALIDITYDATE = string> extends IBaseEntity<TUserId> {
    ticketId: TTICKETID,
    quotationStatusId: QuotationStatuses,
    partsList?: TPARTS,
    labourTime?: number,
    labourRate?: number,
    aditionalNotes?: string,
    validityDate?: VALIDITYDATE,
    technicianId: TTTECHNICIANID,
    partTotalBill?: number,
    labourTotalBill?: number,
    subTotalBill?: number,
    taxAmount?: number,
    netTotal?: number,
    quotationAutoId?: string
}