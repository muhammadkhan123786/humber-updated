import { IBaseEntity } from "../Base.Interface";

export type Service<TACTIVITYID = string> = {
    activityId: TACTIVITYID;
    duration: string; // HH:mm or ISO duration
    description: string;
    additionalNotes?: string;
};

export type Part<TPRODUCTID = string> = {
    productId: TPRODUCTID;
    oldPartConditionDescription?: string;
    newSerialNumber?: string;
    quantity: number;
    unitCost: number;
    totalCost?: number;
    reasonForChange?: string;
};

export type InspectionStatus = "PASS" | "FAIL" | "N/A";

export type Inspection<TINSPECTIONID = string> = {
    inspectionTypeId: TINSPECTIONID;
    status: InspectionStatus;
    notes?: string;
};

export type JobNotes = {
    messages: string[];
    images: string[];   // URLs
    videos: string[];   // URLs
    imageFiles?: File[];
    videoFiles?: File[];
};

export interface ITechnicianRecordActivity<
    TUserId = string,
    TTICKETID = string,
    TTECHNICIANID = string,
    TJOBSTATUSID = string
> extends IBaseEntity<TUserId> {
    jobId: string;
    ticketId: TTICKETID;
    technicianId: TTECHNICIANID;
    services: Service[];
    parts: Part[];
    inspections: Inspection[];
    generalNotes?: string;
    completionSummary?: string;
    jobNotes: JobNotes;
    jobStatusId: TJOBSTATUSID;
}
