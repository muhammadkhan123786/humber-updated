import { IBaseEntity } from "../Base.Interface";
export type JOBSTATUS = "PENDING" | "START" | "ON HOLD" | "END";

export interface IAdminCreateActivity<
    TUserId = string,
    TTICKETID = string,
    TTECHNICIANID = string,
    TQUOTATIONID = string
> extends IBaseEntity<TUserId> {
    jobId: string;
    ticketId: TTICKETID;
    leadingTechnicianId: TTECHNICIANID;
    adminNotes?: string;
    jobStatusId: JOBSTATUS;
    quotationId: TQUOTATIONID;
}