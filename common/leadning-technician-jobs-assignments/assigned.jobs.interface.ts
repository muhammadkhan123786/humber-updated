import { IBaseEntity } from "../Base.Interface";
export type JobAssignmentStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED";

export type JobAssignmentRole = "LEAD" | "SHARED";

export interface IAssignedJobs<
    TUserId = string,
    TJOBID=string,
    TECHNICIANID=string,
    ASSIGNEDBYID=string,
    ACCEPTEDATE=string,
    COMPLETEDATE=string,
> extends IBaseEntity<TUserId> {
    assignmentId:string;
    jobId: TJOBID;
    technicianId:TECHNICIANID;
    generalNotes:string;
    role:JobAssignmentRole;
    assignedBy:ASSIGNEDBYID;
    jobStatus:JobAssignmentStatus;
    acceptedAt:ACCEPTEDATE;
    completedAt:COMPLETEDATE;    
}