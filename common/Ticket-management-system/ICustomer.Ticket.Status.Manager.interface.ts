import { IBaseEntity } from '../Base.Interface';
export type TicketSource = "Phone" | "Online Portal" | "Walk-in";
export type RepairLocation = "Workshop" | "On-Site" | "Mobile Service";
export interface CustomerTicketStatusManager<TUSERID = string, TTICKETID = string, TTICKETSTATUSID = string> extends IBaseEntity<TUSERID> {
    customerTicketId: TTICKETID,
    customerTicketStatusId: TTICKETSTATUSID
}
