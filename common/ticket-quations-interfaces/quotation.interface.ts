import { IBaseEntity } from '../Base.Interface';
export type QuotationStatuses = "SENT TO ADMIN" | "SEND TO CUSTOMER" | "SEND TO INSURANCE" | "APPROVED" | "REJECTED";
export interface ITicketQuotation<TUserId = string, TTICKETID = string, TQUOTATIONPARTS = string[], TTTECHNICIANID = string, VALIDITYDATE = string> extends IBaseEntity<TUserId> {
    ticketId: TTICKETID,
    quotationStatusId: QuotationStatuses,
    partsList?: TQUOTATIONPARTS,
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