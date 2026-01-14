import { IBaseEntity } from '../Base.Interface';
export type TicketSource = "Phone" | "Online Portal" | "Walk-in";
export type RepairLocation = "Workshop" | "On-Site" | "Mobile Service";
export interface CustomerTicketBase<TUSERID = string, TCUSTOMERID = string, TVEHICLEID = string, TURGENCEID = string, TTICKETSTATUSID = string> extends IBaseEntity<TUSERID> {
    ticketSource: TicketSource,
    customerId: TCUSTOMERID,
    vehicleId: TVEHICLEID,
    ticketStatusId: TTICKETSTATUSID
    issue_Details: string,
    location: RepairLocation,
    priorityId: TURGENCEID,
    address?: string,
    ticketCode?: string,
    vehicleRepairImages?: string[],
    vehicleRepairVideoURL?: string,
}

