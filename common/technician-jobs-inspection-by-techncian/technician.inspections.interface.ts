import { IBaseEntity } from "../Base.Interface";

export type INSPECTIONTYPE = "BEFORE SERVICE" | "AFTER SERVICE";
export type InspectionStatus = "PASS" | "FAIL" | "N/A";

export type Inspection<TINSPECTIONID = string> = {
    inspectionTypeId: TINSPECTIONID;
    status: InspectionStatus;
    notes?: string;
};

export interface IINSPECTIONS<
    TUserId = string,
    TJOBID = string,
    IINSPECTIONTYPEID = string,
    TTECHNICIANID = string
> extends IBaseEntity<TUserId> {
    jobId: TJOBID;
    inspectionSummary?: string;
    inspectionTIME: INSPECTIONTYPE;
    inspections: Inspection[];
    inspectionTypeId: IINSPECTIONTYPEID;
    tecnicianId: TTECHNICIANID
}