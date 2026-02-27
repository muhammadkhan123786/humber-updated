import { IBaseEntity } from "../Base.Interface";

export interface ITechnicianRecordActivityMaster<TUserId=string,TTECHNICIANASSIGNEDJOBID=string,TQUOTATIONID=string,TACTIVITYTYPE=string,TTECHNICIANID=string> extends IBaseEntity<TUserId>{
    JobAssignedId:TTECHNICIANASSIGNEDJOBID,
    quotationId:TQUOTATIONID,
    activityType:TACTIVITYTYPE,
    technicianId:TTECHNICIANID,
    additionalNotes:string
}