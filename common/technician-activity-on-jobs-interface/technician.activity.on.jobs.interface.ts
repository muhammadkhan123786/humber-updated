import { IBaseEntity } from "../Base.Interface";
export type activitiyStatus = "pending"| "in_progress"| "paused"| "completed";
export type TimeLog<PARTSID = string | string[], QUOTATIONPARTID = string> = {
  startTime: Date;
  endTime?: Date;
  partsUsed?: {
    partId: PARTSID;               // reference to actual Part(s)
    quotationPartId?: QUOTATIONPARTID; // optional reference to quotation part
    quantityUsed: number;          // how many units used
  }[];                             // <-- change from tuple [ {...} ] to array {...}[]
};
export interface ITechnicianRecordActivityMaster<TUserId=string,TTECHNICIANASSIGNEDJOBID=string,TQUOTATIONID=string,TACTIVITYTYPE=string,TTECHNICIANID=string> extends IBaseEntity<TUserId>{
    JobAssignedId:TTECHNICIANASSIGNEDJOBID,
    quotationId:TQUOTATIONID,
    activityType:TACTIVITYTYPE,
    technicianId:TTECHNICIANID,
    additionalNotes:string,
    status:activitiyStatus,
    timeLogs:TimeLog[],
    totalTimeInSeconds:number
}