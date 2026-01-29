import { IBaseEntity } from "../Base.Interface";
export type TicketSource = "Phone" | "Online Portal" | "Walk-in";
export type RepairLocation = "Workshop" | "On-Site" | "Mobile Service";
export type ProductOwnerShip = "Customer Product" | "Company product";

export interface investigationParts<TPARTID = string> {
  partId: TPARTID,
  quantity: number,
  unitCost: number,
  total: number
}
export interface CustomerTicketBase<
  TUSERID = string,
  TCUSTOMERID = string,
  TVEHICLEID = string,
  TURGENCEID = string,
  TTICKETSTATUSID = string,
  TTECHID = string[],
  TDECISIONID = string,
  TPARTID = string
> extends IBaseEntity<TUSERID> {
  ticketSource: TicketSource;
  customerId: TCUSTOMERID;
  vehicleId: TVEHICLEID;
  ticketStatusId: TTICKETSTATUSID;
  issue_Details: string;
  location: RepairLocation;
  priorityId: TURGENCEID;
  assignedTechnicianId?: TTECHID | null;
  address?: string;
  ticketCode?: string;
  vehicleRepairImages?: string[];
  vehicleRepairImagesFile?: File[];
  vehicleRepairVideoURL?: string;
  //new 
  productOwnership: ProductOwnerShip;
  productSerialNumber?: string;
  purchaseDate?: Date;
  decisionId?: TDECISIONID;
  investigationReportData: string;
  investigationParts: investigationParts<TPARTID>[],
  isEmailSendReport: boolean
}
