import { IBaseEntity } from '../Base.Interface';
export interface ITicketQuotation<TUserId = string, TTICKETQUOTATIONSTATUSID = string, TQUOTATIONPARTS = string[], TTTECHNICIANID = string> extends IBaseEntity<TUserId> {
    ticketQuationStatus: string,
    quotationStatusId: TTICKETQUOTATIONSTATUSID,
    partsList?: TQUOTATIONPARTS,
    labourTime?: number,
    labourRate?: number,
    aditionalNotes?: string,
    validityDate?: string,
    technicianId: TTTECHNICIANID,
    partTotalBill?: number,
    labourTotalBill?: number,
    subTotalBill?: number,
    taxAmount?: number,
    netTotal?: number,
    quotationId?: string
}