import { IBaseEntity } from '../Base.Interface';

export interface ITechnicianJobInfo<TUserId = string, TTICKETID = string, TTECHNICIANID = string> extends IBaseEntity<TUserId> {
    ticketId: TTICKETID;
    jobId: string;
    technicianId: string;

}

