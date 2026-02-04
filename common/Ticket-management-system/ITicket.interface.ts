import { IBaseEntity } from "../Base.Interface";
export type TicketSource = "Phone" | "Online Portal" | "Walk-in";
export type RepairLocation = "Workshop" | "On-Site" | "Mobile Service";
export type ProductOwnerShip = "Customer Product" | "Company product";
export type VehicleDropOff = "Customer-Drop" | "Company-Pickup";
export type PickupBy = "External Company" | "Company Rider";

export interface investigationParts<TPARTID = string> {
  partId: TPARTID;
  quantity: number;
  unitCost: number;
  total: number;
}

export type Decisions = "Covered" | "Chargeable" | "Mixed";
export interface CustomerTicketBase<
  TUSERID = string,
  TCUSTOMERID = string,
  TVEHICLEID = string,
  TURGENCEID = string,
  TTICKETSTATUSID = string,
  TTECHID = string[],
  TINSURANCECOMPANYID = string,
  TRIDERID = string
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
  // productSerialNumber?: string;
  //purchaseDate?: Date;
  decisionId?: Decisions;
  // investigationReportData: string;
  //  investigationParts?: investigationParts<TPARTID>[];
  // isEmailSendReport: boolean;
  insuranceId?: TINSURANCECOMPANYID,
  insuranceReferenceNumber?: string,
  vehiclePickUp?: VehicleDropOff,
  pickUpDate?: string,
  pickUpBy?: PickupBy,
  externalCompanyName?: string,
  riderId?: TRIDERID
}
