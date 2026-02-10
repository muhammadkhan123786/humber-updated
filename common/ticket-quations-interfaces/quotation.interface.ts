import { IBaseEntity } from '../Base.Interface';
export interface ITicketQuotation<TUserId = string, TTICKETID = string, TTICKETQUOTATIONSTATUSID = string, TQUOTATIONPARTS = string[], TTTECHNICIANID = string, VALIDITYDATE = string> extends IBaseEntity<TUserId> {
    ticketId: TTICKETID,
    quotationStatusId: TTICKETQUOTATIONSTATUSID,
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